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

ace.define("ace/snippets/haml",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet t\n\
	%table\n\
		%tr\n\
			%th\n\
				${1:headers}\n\
		%tr\n\
			%td\n\
				${2:headers}\n\
snippet ul\n\
	%ul\n\
		%li\n\
			${1:item}\n\
		%li\n\
snippet =rp\n\
	= render :partial => '${1:partial}'\n\
snippet =rpl\n\
	= render :partial => '${1:partial}', :locals => {}\n\
snippet =rpc\n\
	= render :partial => '${1:partial}', :collection => @$1\n\
\n\
";
exports.scope = "haml";

});
                (function() {
                    ace.require(["ace/snippets/haml"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            