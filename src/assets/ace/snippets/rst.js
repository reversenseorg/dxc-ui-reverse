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

ace.define("ace/snippets/rst",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# rst\n\
\n\
snippet :\n\
	:${1:field name}: ${2:field body}\n\
snippet *\n\
	*${1:Emphasis}*\n\
snippet **\n\
	**${1:Strong emphasis}**\n\
snippet _\n\
	\\`${1:hyperlink-name}\\`_\n\
	.. _\\`$1\\`: ${2:link-block}\n\
snippet =\n\
	${1:Title}\n\
	=====${2:=}\n\
	${3}\n\
snippet -\n\
	${1:Title}\n\
	-----${2:-}\n\
	${3}\n\
snippet cont:\n\
	.. contents::\n\
	\n\
";
exports.scope = "rst";

});
                (function() {
                    ace.require(["ace/snippets/rst"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            