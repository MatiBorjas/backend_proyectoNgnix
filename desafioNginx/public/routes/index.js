import homeRouter from "./homeRouter.js";
import loginRouter from "./loginRouter.js";
import signupRouter from "./signupRouter.js";
import productosRouter from "./productosRouter.js";
import logoutRouter from "./logoutRouter.js";
import apiRandomRouter from "./apiRandomRouter.js";

import parseArgs from "minimist";

const infoRouter = (req, res) => {
  try {
    const args = parseArgs(process.argv.slice(2));
    const info = {
      argumentos: JSON.stringify(args),
      directorioActual: process.cwd(),
      idProceso: process.pid,
      vNode: process.version,
      rutaEjecutable: process.execPath,
      sistemaOperativo: process.platform,
      memoria: JSON.stringify(process.memoryUsage().rss, null, 2),
    };
    res.render("pages/info", info);
  } catch (error) {
    res.render(error.message);
  }
};

export { homeRouter, productosRouter, loginRouter, signupRouter, logoutRouter, infoRouter, apiRandomRouter };