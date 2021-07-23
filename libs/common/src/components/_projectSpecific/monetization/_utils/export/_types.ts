export type FeatureSectionColumnsData = Array<{ header: string; values: Array<string | number> }>;
export type FeatureSectionData = { title?: string; columnsData: FeatureSectionColumnsData };
export type ExportDataType = Partial<Record<string, string[][]>>;
