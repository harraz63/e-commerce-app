import cron from "node-cron";
import { BlackListedModel } from "../DB/Models";

export const startClearBlackListJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const result = await BlackListedModel.deleteMany({
        expirationDate: { $lt: new Date() },
      });
      console.log(`✅ Deleted ${result.deletedCount} expired tokens`);
    } catch (err) {
      console.error("❌ Error clearing blacklist tokens:", err);
    }
  });
};
