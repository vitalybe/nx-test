import { sleep } from "./sleep";
import { Utils } from "./utils";

describe("commonBackendUtils", function() {
  it("should utilise fetching all pages from a paginated api", async function() {
    const pages: Array<{ name: string }>[] = [
      [
        {
          name: "foo",
        },
        {
          name: "bar",
        },
        {
          name: "foo2",
        },
      ],
      [
        {
          name: "bar2",
        },
        {
          name: "foo3",
        },
      ],
    ];

    const callback = async (c: number, n: number) => {
      await sleep(100);
      return pages[n];
    };

    const result = await Utils.fetchAllPages(callback, 3);
    expect(result.length).toBe(5);
    expect(result).toEqual(pages.flatMap(page => page));
  });
});
