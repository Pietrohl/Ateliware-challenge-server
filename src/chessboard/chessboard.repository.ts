import https from "https";
import { logger } from "../utils";
import { type Chessboard } from "./models/chessboard.model";
export type ChessboardRepository = { getBoard: () => Promise<Chessboard> };

export const createChessboardRepository = () => {
  logger.info("Initiating Chessboard Repository...");
  let chessboard: Chessboard;

  function updateBoard() {
    return new Promise<void>((resolve, reject) => {
      https
        .get(
          "https://mocki.io/v1/10404696-fd43-4481-a7ed-f9369073252f",
          (res) => {
            let data: Uint8Array[] = [];

            res.on("data", (chunk) => {
              data.push(chunk);
            });

            res.on("end", () => {
              const map = JSON.parse(Buffer.concat(data).toString());
              const times: number[] = Object.values(map).flatMap((obj) =>
                Object.values(obj as {})
              );
              const avrgTime =
                times.reduce(
                  (accumulator, currentValue) => accumulator + currentValue,
                  0
                ) / times.length;
              chessboard = { avrgTime, map };
              resolve();
            });
          }
        )
        .on("error", (err) => {
          logger.error(`error loading on ${err}`);
          reject(`error loading on ${err}`);
        });
    });
  }

  updateBoard();

  return {
    getBoard: async () => {
      if (!chessboard) await updateBoard();

      return chessboard;
    },
  };
};
