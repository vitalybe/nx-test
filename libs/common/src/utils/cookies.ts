interface CookieOptions {
  path?: string;
  domain?: string;
  days?: number;
}

export class Cookies {
  static set(name: string, value: string = "", options: CookieOptions) {
    let stringifiedOptions = "";

    if (options?.path) {
      stringifiedOptions += `; path=${options?.path}`;
    }

    if (options?.domain) {
      stringifiedOptions += `; domain=${options?.domain}`;
    }

    if (options?.days) {
      const date = new Date();
      date.setTime(date.getTime() + options?.days * 24 * 60 * 60 * 1000);
      stringifiedOptions += "; expires=" + date.toUTCString();
    }

    document.cookie = `${name}=${value}${stringifiedOptions ? `;${stringifiedOptions}` : ""}`;
  }

  static get(name: string) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  }

  static remove(name: string) {
    document.cookie = name + "=; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
  }

  static removeByDomain(name: string, domain: string) {
    document.cookie = name + "=; domain=" + domain + "; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
  }
}
