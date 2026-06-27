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

ace.define("ace/snippets/textile",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# Jekyll post header\n\
snippet header\n\
	---\n\
	title: ${1:title}\n\
	layout: post\n\
	date: ${2:date} ${3:hour:minute:second} -05:00\n\
	---\n\
\n\
# Image\n\
snippet img\n\
	!${1:url}(${2:title}):${3:link}!\n\
\n\
# Table\n\
snippet |\n\
	|${1}|${2}\n\
\n\
# Link\n\
snippet link\n\
	\"${1:link text}\":${2:url}\n\
\n\
# Acronym\n\
snippet (\n\
	(${1:Expand acronym})${2}\n\
\n\
# Footnote\n\
snippet fn\n\
	[${1:ref number}] ${3}\n\
\n\
	fn$1. ${2:footnote}\n\
	\n\
";
exports.scope = "textile";

});
                (function() {
                    ace.require(["ace/snippets/textile"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            