interface Device {
  uuid: string;
  id: string;
  name: string;
  type: string;
  location: string;
  quickActionStatus: boolean;
  dimValue: number;
}

export default Device;
