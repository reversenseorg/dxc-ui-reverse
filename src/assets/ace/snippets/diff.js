/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

ace.define("ace/snippets/diff",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# DEP-3 (http://dep.debian.net/deps/dep3/) style patch header\n\
snippet header DEP-3 style header\n\
	Description: ${1}\n\
	Origin: ${2:vendor|upstream|other}, ${3:url of the original patch}\n\
	Bug: ${4:url in upstream bugtracker}\n\
	Forwarded: ${5:no|not-needed|url}\n\
	Author: ${6:`g:snips_author`}\n\
	Reviewed-by: ${7:name and email}\n\
	Last-Update: ${8:`strftime(\"%Y-%m-%d\")`}\n\
	Applied-Upstream: ${9:upstream version|url|commit}\n\
\n\
";
exports.scope = "diff";

});
                (function() {
                    ace.require(["ace/snippets/diff"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            