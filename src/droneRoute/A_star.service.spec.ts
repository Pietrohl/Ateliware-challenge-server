import { PlanarGraph, calcRoute } from "./A_star.service";

describe("A* Route Algorithm", () => {
  const graph = new PlanarGraph({
    avrgTime: 9.7,
    map: {
      A1: { A2: 11.88, B1: 10.46 },
      A2: { A3: 22, B2: 24.6, A1: 21.77 },
      A3: { A4: 25.63, B3: 12.66, A2: 22.5 },
      A4: { A5: 27.69, B4: 16.35, A3: 15.5 },
      A5: { A6: 28.77, B5: 18.45, A4: 15.49 },
      A6: { A7: 23.72, B6: 19.73, A5: 25.55 },
      A7: { A8: 16.91, B7: 27.97, A6: 20.31 },
      B1: { A1: 23.01, B2: 20.19, C1: 15.37 },
      B2: { A2: 26.7, B3: 29, C2: 20.85, B1: 13.88 },
      B3: { A3: 23.3, B4: 20.27, C3: 17.33, B2: 18.72 },
      B4: { A4: 17.7, B5: 18.32, C4: 15.52, B3: 10.5 },
      B5: { A5: 29.89, B6: 11.89, C5: 25.49, B4: 25.79 },
      B6: { A6: 25.02, B7: 24.5, C6: 17.05, B5: 23.14 },
      B7: { A7: 16.71, B8: 17.4, C7: 15.64, B6: 11.37 },
      C1: { B1: 11.16, C2: 18.99, D1: 18.76 },
      C2: { B2: 10.13, C3: 16.14, D2: 24.8, C1: 25.6 },
      C3: { B3: 11.24, C4: 13.38, D3: 12.49, C2: 17.71 },
      C4: { B4: 12.42, C5: 25.94, D4: 26.4, C3: 24.58 },
      C5: { B5: 24.9, C6: 19.74, D5: 15.26, C4: 28.16 },
      C6: { B6: 10.8, C7: 23.36, D6: 27.99, C5: 14.05 },
      C7: { B7: 15.68, C8: 21.51, D7: 11.63, C6: 19.82 },
      D1: { C1: 29.2, D2: 29.53, E1: 25.85 },
      D2: { C2: 15.28, D3: 28.14, E2: 17.91, D1: 28.56 },
      D3: { C3: 23.68, D4: 20.38, E3: 16.6, D2: 28.92 },
      D4: { C4: 17.09, D5: 24.63, E4: 27.47, D3: 11.49 },
      D5: { C5: 18.1, D6: 10.55, E5: 14.65, D4: 18.99 },
      D6: { C6: 25.41, D7: 24.82, E6: 20.78, D5: 25.4 },
      D7: { C7: 27.82, D8: 29.43, E7: 16.48, D6: 25.67 },
      E1: { D1: 26.5, E2: 17.15, F1: 14.51 },
      E2: { D2: 24.84, E3: 29.37, F2: 29.17, E1: 27.97 },
      E3: { D3: 20.95, E4: 26.38, F3: 11.18, E2: 24.68 },
      E4: { D4: 21.36, E5: 26.06, F4: 26.86, E3: 27.67 },
      E5: { D5: 23.59, E6: 10.27, F5: 27.08, E4: 19.07 },
      E6: { D6: 12.59, E7: 18.38, F6: 12.41, E5: 13.4 },
      E7: { D7: 25.73, E8: 25.3, F7: 14.11, E6: 20 },
      F1: { E1: 16.74, F2: 26.56, G1: 14.33 },
      F2: { E2: 15.89, F3: 20.45, G2: 21.11, F1: 20.66 },
      F3: { E3: 20.41, F4: 24.1, G3: 27.6, F2: 11.6 },
      F4: { E4: 26.27, F5: 14.46, G4: 13.49, F3: 16.35 },
      F5: { E5: 20.37, F6: 10.94, G5: 23.49, F4: 25.08 },
      F6: { E6: 28.62, F7: 11.07, G6: 12.35, F5: 25.06 },
      F7: { E7: 25.46, F8: 26.98, G7: 24.79, F6: 26.27 },
      G1: { F1: 20.2, G2: 26.97, H1: 22.45 },
      G2: { F2: 28.85, G3: 20.83, H2: 28.92, G1: 23.61 },
      G3: { F3: 26.79, G4: 12.73, H3: 15.58, G2: 10.76 },
      G4: { F4: 20.94, G5: 28.42, H4: 24.46, G3: 14.36 },
      G5: { F5: 22.68, G6: 26.19, H5: 12.81, G4: 20.05 },
      G6: { F6: 12.65, G7: 11.5, H6: 20.88, G5: 28.93 },
      G7: { F7: 14.39, G8: 16.02, H7: 17.99, G6: 17.64 },
      A8: { B8: 10.85, A7: 18.83 },
      B8: { A8: 29.59, C8: 21.91, B7: 23 },
      C8: { B8: 28.77, D8: 13, C7: 24.24 },
      D8: { C8: 14.18, E8: 13.18, D7: 16.15 },
      E8: { D8: 22.39, F8: 26.48, E7: 10.59 },
      F8: { E8: 16.02, G8: 16.84, F7: 11.63 },
      G8: { F8: 15.66, H8: 25.25, G7: 13.51 },
      H1: { G1: 20.27, H2: 28.45, I1: 27.9 },
      H2: { G2: 10.88, H3: 10.54, H1: 18.53, I2: 22.3 },
      H3: { G3: 18.84, H4: 23.07, H2: 14.64, I3: 9.2 },
      H4: { G4: 23.14, H5: 12.47, H3: 10.54, I4: 10.9 },
      H5: { G5: 23.81, H6: 19.53, H4: 25.93, I5: 5.2 },
      H6: { G6: 18.3, H7: 10.89, H5: 12.65, I6: 30.2 },
      H7: { G7: 20.93, H8: 11.74, H6: 14.12, I7: 19.2 },
      H8: { G8: 11.86, H7: 21.53, I8: 32.53 },
      I1: { H1: 10.9, I2: 10.9 },
      I2: { H2: 10.9, I3: 10.9, I1: 10.9 },
      I3: { H3: 10.9, I4: 10.9, I2: 10.9 },
      I4: { H4: 10.9, I5: 10.9, I3: 20.9 },
      I5: { H5: 10.9, I6: 11.9, I4: 10.9 },
      I6: { H6: 10.9, I7: 13.2, I5: 10.9 },
      I7: { H7: 10.9, I8: 10.9, I6: 10.9 },
      I8: { H8: 10.9, I7: 10.9 },
    },
  });

  it("should return the correct path", () => {
    expect(
      calcRoute({
        graph,
        startKey: "A1",
        endKey: "B3",
      })
    ).toMatchObject({
      cost: 46.540000000000006,
      path: ["A1", "A2", "A3", "B3"],
    });
  });

  it("should return the correct path using fibonacci queue", () => {
    expect(
      calcRoute(
        {
          graph,
          startKey: "A1",
          endKey: "B3",
        },
        "fib"
      )
    ).toMatchObject({
      cost: 46.540000000000006,
      path: ["A1", "A2", "A3", "B3"],
    });
  });
});
