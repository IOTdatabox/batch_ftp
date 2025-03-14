export interface IBatchType {
  CampaignId: number;
  ActionTrackerId: number;
  EventDate: string;
  ClickId: string;
  OrderId?: string;
  CustomerId?: string;
  CustomerEmail?: string;
}

export interface IFile {
  filename: string;
  filepath: string;
}
