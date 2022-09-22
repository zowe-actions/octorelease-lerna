/**
 * Copyright 2022 Octorelease Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as fs from "fs";
import * as path from "path";
import { IContext } from "@octorelease/core";
import { IPluginConfig } from "./config";
import * as utils from "./utils";

export default async function (context: IContext, _config: IPluginConfig): Promise<void> {
    if (context.version.new != null) {
        const packageInfo = await utils.lernaList(true);
        await utils.lernaVersion(context.version.new);
        const lockfilePath = fs.existsSync("npm-shrinkwrap.json") ? "npm-shrinkwrap.json" : "package-lock.json";
        context.changedFiles.push("lerna.json", "package.json", lockfilePath);
        for (const { location } of packageInfo) {
            const relLocation = path.relative(process.cwd(), location);
            context.changedFiles.push(path.join(relLocation, "package.json"));
        }
    }
}
