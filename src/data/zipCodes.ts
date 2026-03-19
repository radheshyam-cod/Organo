// List of pincodes where Local Delivery is available (Mocked for 6-digit format)
const LOCAL_PINCODES = [
  // Mock Local Zones (e.g., specific city sectors)
  "500032",
  "500033",
  "500034",
  "500081",
  "500082",
  "110001",
  "110002",
  "110003", // New Delhi sample
  "400001",
  "400002", // Mumbai sample
  "400615",
  "418003",
  "411013",
  "411033", // Requested zips
];

export type DeliveryStatus = "idle" | "local" | "national" | "invalid";

export const checkAvailability = (pincode: string): DeliveryStatus => {
  // Validation: must be 6 digits, starting 1-9
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return "invalid";
  }

  if (LOCAL_PINCODES.includes(pincode)) {
    return "local";
  }

  return "national";
};
