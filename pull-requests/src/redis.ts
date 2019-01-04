import * as redis from "redis";
import { promisify } from "util";
import { stat } from "fs";

const client: redis.RedisClient = redis.createClient();

const getAsync: (arg: string) => Promise<string> = promisify(client.get).bind(
  client
);

export const getStatus: (taskId: string) => Promise<string> = async taskId => {
  return await getAsync(taskId);
};

export const setStatus: (taskId: string, status: string) => void = (
  taskId,
  status
) => {
  client.set(taskId, status);
};
