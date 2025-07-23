export type BatchPayOptions = {
  identity: string;
  receivers: string;
};

export type ConfirmRewardOptions = {
  orderId: string;
};

export type CreateRewardOptions = {
  budget: string;
  platform: string;
  contentId: string;
};

export type PayOptions = {
  identity: string;
  username: string;
  amount: string;
};

export type CommandName =
  | "pay"
  | "batch-pay"
  | "env"
  | "create-reward-distribution"
  | "confirm-reward-distribution";
