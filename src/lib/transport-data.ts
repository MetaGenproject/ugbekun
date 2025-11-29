
export type RouteStatus = "On Route" | "Idle" | "Maintenance";

export type Route = {
  id: string;
  routeName: string;
  driverName: string;
  busNumber: string;
  students: number;
  status: RouteStatus;
};

export const initialRoutes: Route[] = [
  { id: "rt-01", routeName: "Lekki-Ajah", driverName: "Mr. Sam", busNumber: "BUS-012", students: 25, status: "On Route" },
  { id: "rt-02", routeName: "Ikeja-GRA", driverName: "Mr. Ben", busNumber: "BUS-007", students: 18, status: "Idle" },
  { id: "rt-03", routeName: "Surulere-Yaba", driverName: "Mr. John", busNumber: "BUS-003", students: 22, status: "Idle" },
  { id: "rt-04", routeName: "Festac Town", driverName: "Mr. Mike", busNumber: "BUS-009", students: 15, status: "Maintenance" },
];

export const statusStyles: Record<RouteStatus, string> = {
  "On Route": "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Idle: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
  Maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
};
