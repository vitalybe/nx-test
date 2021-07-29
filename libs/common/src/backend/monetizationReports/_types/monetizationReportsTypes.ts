import { MetadataServiceTypeEnum } from "../../deliveryServices/_types/deliveryServiceMetadataTypes";
import { CurrencyUnitEnum } from "common/components/_projectSpecific/monetization/_utils/currencyUtils";
// region [[ DA Report ]]
// Overtime
export interface MonetizationApiDaOvertimeResponse {
  monthSamples: Array<MonetizationApiDaMonthSampleType>;
}
export interface MonetizationApiDaMonthSampleType {
  month: string;
  sps: MonetizationApiDaMonthSamplePerSpType[];
  spRevenue: number;
  cqRevenue: number;
  daRevenue: number;
  overallRevenue: number;
  spRevenueFromProjectStart: number;
  cqRevenueFromProjectStart: number;
  daRevenueFromProjectStart: number;
  overallRevenueFromProjectStart: number;
  volume: number;
}
export interface MonetizationApiDaMonthSamplePerSpType {
  spName: string; // org id
  projects: Array<{
    contractId: string;
    spRevenue: number;
    cqRevenue: number;
    daRevenue: number;
    overallRevenue: number;
    spRevenueFromProjectStart: number;
    cqRevenueFromProjectStart: number;
    daRevenueFromProjectStart: number;
    overallRevenueFromProjectStart: number;
    volume: number;
  }>;
  spRevenue: number;
  cqRevenue: number;
  daRevenue: number;
  overallRevenue: number;
  spRevenueFromProjectStart: number;
  cqRevenueFromProjectStart: number;
  daRevenueFromProjectStart: number;
  overallRevenueFromProjectStart: number;
  volume: number;
}

// Peaks
export interface MonetizationApiDaPeaksResponse {
  peakDelivery: number;
  peakDeliveryTime: string;
  peakDeliveryTimeEpoch: number;
  peakBw: number;
  peakBwTime: string;
  peakBwTimeEpoch: number;
  peakUtilization: number;
  peakUtilizationTime: string;
  peakUtilizationTimeEpoch: number;
}

// Projects
export interface MonetizationApiDaProjectsResponse {
  sps: Array<{
    spName: string; // org id
    projects: Array<{
      contractId: string;
      contractName: string;
      currentPhase: string;
      currency: string;
      capacity: number; //mbps
      markers: {
        projectStartDate: string;
        projectStartDateEpoch: number;
        projectEndDate: string;
        projectEndDateEpoch: number;
        investment: number;
        actualFinancingCompletionDate: string;
        actualFinancingCompletionDateEpoch: number;
      };
    }>;
    capacity: number; //mbps
    investment: number;
  }>;
  capacity: number; //mbps
  investment: number;
}

// endregion
//region [[ CP Report ]]
// [[ Overtime ]]

export interface MonetizationApiCpOvertimeResponse {
  months: MonetizationApiCpOvertimeMonthSample[];
}

export interface MonetizationApiCpOvertimeMonthSample {
  month: string; //<mm-YYYY>;
  charge: number;
  volume: number;
  isps: MonetizationApiCpOvertimeIspMonthSample[];
}
interface MonetizationApiCpOvertimeIspMonthSample {
  isp: string;
  charge: number;
  volume: number;
}

// [[ Monthly ]]]
export interface MonetizationApiCpMonthlyResponse {
  services: MonetizationApiCpMonthlyPerService[];
  isps: MonetizationApiCpMonthlyPerIsp[];
}

export interface MonetizationApiCpMonthlyPerService {
  service: MetadataServiceTypeEnum;
  charge: number;
  volume: number;
  pricePerMB: number;
}
export interface MonetizationApiCpMonthlyPerIsp {
  isp: string;
  charge: number;
  volume: number;
  pricePerMB: number;
  services: MonetizationApiCpMonthlyPerIspPerService[];
}
interface MonetizationApiCpMonthlyPerIspPerService {
  service: MetadataServiceTypeEnum;
  charge: number;
  volume: number;
  pricePerMB: number;
}

export interface MonetizationApiCpPeaksResponse {
  peakDelivery: number;
  peakDeliveryTimeEpoch: number; // epoch seconds
  peakBw: number;
  peakBwTimeEpoch: number; // epoch seconds
  peakCE: number;
  peakCETimeEpoch: number; // epoch seconds
}
//endregion

//region [[ SP Report ]]
export interface MonetizationApiSpOvertimeResponse {
  projects: Array<{ monthSamples: MonetizationApiSpMonthSampleType[] }>;
}

export interface MonetizationApiSpPeaksResponse {
  peakDelivery: number;
  peakDeliveryTimeEpoch: number; // epoch seconds
  peakBw: number;
  peakBwTimeEpoch: number; // epoch seconds
  peakUtilization: number;
  peakUtilizationTimeEpoch: number; // epoch seconds
}

export interface MonetizationApiSpMonthSampleType {
  reportId: string;
  month: string;
  spRevenue: number;
  cqdaRevenue: number;
  overallRevenue: number;
  spRevenueFromProjectStart: number;
  cqdaRevenueFromProjectStart: number;
  overallRevenueFromProjectStart: number;
  volume: number;
}

// [[ Monthly CPs Data ]]
export interface MonetizationApiSpMonthlyResponse {
  projects: Array<{ reportId: string; cps: Array<MonetizationApiSpMonthlyPerCp> }>;
}
export interface MonetizationApiSpMonthlyPerCp {
  cp: string;
  totalRevenue: number;
  totalRevenueFromProjectStart: number;
  volume: number;
  volumeFromProjectStart: number;
  services: Array<MonetizationApiSpServiceType>;
}

export interface MonetizationApiSpServiceType {
  service: string;
  volume: number;
  revenue: number;
  rate: number;
  revenueFromProjectStart: number;
  volumeFromProjectStart: number;
}

// [[ Projects ]]
export interface MonetizationApiProjectsResponse {
  projects: Array<MonetizationApiProjectType>;
}

export interface MonetizationApiProjectType {
  reportId: string;
  currentPhase: string;
  currency: string;
  capacity: number; // Mbps
  markers: MonetizationApiProjectMarkersType;
  cps: Array<string>;
}

export interface MonetizationApiProjectMarkersType {
  projectStartDate: string;
  projectStartDateEpoch: number;
  projectEndDate: string;
  projectEndDateEpoch: number;
  revenueThreshold?: number;
  expectedFinancingCompletionDate?: string;
  expectedFinancingCompletionDateEpoch?: number;
  actualFinancingCompletionDate?: string;
  actualFinancingCompletionDateEpoch?: number;
}
// endregion

// region [[ Payments ]]

export interface MonetizationApiDaPaymentsResponse {
  payments: Array<ApiDaPaymentType>;
}

export interface MonetizationApiCpPaymentsResponse {
  payments: Array<ApiCpPaymentType>;
}

export interface MonetizationApiSpPaymentsResponse {
  projects: Array<ApiIspPaymentType>;
}

export enum PaymentStatusShared {
  PENDING = "pending",
  INVOICE_SENT = "invoiceSent",
  PAYMENT_SENT = "paymentSent",
  RECEIPT_RECEIVED = "receiptReceived",
}

export interface ApiIspPaymentPayloadType {
  paymentId: string; // <payment-id>
  ispId: string; // <service-provider-org-id>
  month: string; // <MM-yyyy>
  amount: number;
  volume: number; // bytes
  currency: string;
  allCpPaymentsReceived?: boolean; // in configuration payment this will always be false - only to use from report's payments
  invoiceSentDateEpoch?: number; //<epoch-seconds>
  paymentSentDateEpoch?: number; //<epoch-seconds>
  receiptReceivedDateEpoch?: number; //<epoch-seconds>
  cpPayments: SpPaymentPerCpType[];
  paymentStatus: PaymentStatusShared;
}
//DA
export interface ApiDaPaymentPayloadType {
  paymentId: string; //<payment-id>
  month: string; //<mm-YYYY>
  contractId: string;
  spName: string; //<service-provider-org-id>
  volume: number;
  amount: number;
  currency: CurrencyUnitEnum;
  paymentStatus: PaymentStatusShared;
  invoiceSentDateEpoch: number;
  paymentSentDateEpoch: number;
  receiptReceivedDateEpoch: number;
  allCpPaymentsReceived: boolean;
  cpPayments: DaPaymentPerCpType[];
}
export interface DaPaymentPerCpType {
  cpName: string; //<content-provider-org-id>
  volume: number;
  amount: number;
  currency: CurrencyUnitEnum;
}
export interface ApiDaPaymentType extends ApiDaPaymentPayloadType {
  invoiceSentDate: string; //<YYYY-MM-dd>
  paymentSentDate: string; //<YYYY-MM-dd>
  receiptReceivedDate: string; //<YYYY-MM-dd>
}
// SP
export interface ApiIspPaymentType extends ApiIspPaymentPayloadType {
  invoiceSentDate?: string; //<yyyy-MM-dd>
  paymentSentDate?: string; //<yyyy-MM-dd>
  receiptReceivedDate?: string; //<yyyy-MM-dd>
}
export interface SpPaymentPerCpType {
  cpId: string;
  volume: number;
  amount: number;
  currency: string;
  invoiceSentDateEpoch?: number; //<epoch-seconds>
  paymentSentDateEpoch?: number; //<epoch-seconds>
  receiptReceivedDateEpoch?: number; //<epoch-seconds>
}

//CP
export interface ApiCpPaymentPayloadType {
  paymentId: string; // <payment-id>
  cpId: string; // <content-publisher-id>
  month: string; // <MM-yyyy>
  amount: number;
  currency: string;
  paymentStatus: "pending" | "invoiceSent" | "paymentReceived" | "receiptSent";
  invoiceSentDateEpoch?: number; //<epoch-seconds>
  paymentReceivedDateEpoch?: number; //<epoch-seconds>
  receiptSentDateEpoch?: number; //<epoch-seconds>
  spPayments: CpPaymentPerSpType[];
}
export interface ApiCpPaymentType extends ApiCpPaymentPayloadType {
  invoiceSentDate?: string; //<yyyy-MM-dd>
  paymentReceivedDate?: string; //<yyyy-MM-dd>
  receiptSentDate?: string; //<yyyy-MM-dd>
}

export interface CpPaymentPerSpType {
  orgId: string;
  volume: number;
  amount: number;
  currency: string;
}

// endregion
