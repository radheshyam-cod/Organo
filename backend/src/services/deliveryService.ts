import prisma from "../utils/prisma.js";

export async function checkPincode(pincode: string) {
  const entry = await prisma.pincodeService.findUnique({
    where: { pincode },
  });

  if (!entry) {
    return {
      isServiceable: false,
      type: null,
      eta: null,
    };
  }

  const type = entry.isLocal ? ("local" as const) : ("national" as const);
  const eta = entry.isLocal ? "30 mins" : "2 days";

  return {
    isServiceable: true,
    type,
    eta,
  };
}
