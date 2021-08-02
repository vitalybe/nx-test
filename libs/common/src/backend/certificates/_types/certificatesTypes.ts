export interface CertificatesApiType {
  certId: string;
  certificate: string;
  certificateChain: string;
  pkHash: string;
  tenant: string;
  devorg: string;
  domain: string;
  status: string;
  type: string;
  notBefore: string;
  notAfter: string;
  thumbprint: string;
  description: string;
  serialNumber: string;
  creationDate: string;
  links: string[];
}

export interface CertificateCreateApiType {
  certificate: string;
  certificateChain: string;
  privateKey: string;
}
