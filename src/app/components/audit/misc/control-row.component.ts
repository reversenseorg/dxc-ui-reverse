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

import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ProjectService} from "../../project/ctrl/project.service";
import {OutputService} from "../../output/ctrl/output.service";
import {SearchService} from "../../search/ctrl/search.service";
import {Nullable} from "../../../base/Nullable";
import {DxcComponent} from "../../../base/DxcComponent";
import Control from "../../../models/audit/common/Control";
import {AuditService} from "../ctrl/audit.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

/**
 * Represent a Control point, it contains :
 * - a set of Control Assessments
 * - a set of sub Controls
 *
 * Every rules inside a Control Assessment share the same
 * test type (sast, dast, symbolic, emu, ..)
 *
 * @class
 */
@Component({
    selector: 'dxc-audit-control',
    template: `
        <div class="row g-0 dxc-text-100 dxc-text-std dxc-control-row" [ngStyle]="style" style="padding:0; cursor: pointer;">
            <div class="col-11 dxc-text-100" (click)="showDescription()">
                {{ control.name }}
            </div>
            <div *ngIf="addRuleOpt" class="col-1 dxc-text-100">
                <span class="dxc-text-black add-rule" (click)="auditSvc.openAssessEditor(control); $event.stopPropagation()"><dxc-icon [model]="gIcons['PLUS']" [color1]="'#000000'"></dxc-icon>&nbsp;add</span>
            </div>
            <div class="col-12 dxc-text-100 description-text" *ngIf="show" [innerHTML]="sanitizedDescription">
            </div>
        </div>
        <ng-container  *ngFor="let a of control.assessments">
            <dxc-audit-assessment *ngIf="a!=null" [assessement]="a" (onScanning)="onScanning.emit($event)"  (onDryRunSuccess)="onDryRunSuccess.emit($event)"></dxc-audit-assessment>
        </ng-container>
    `,
    styles:[`
      .dxc-control-row {
        font-weight: bold;
      }
      span.add-rule:hover {
        text-decoration: underline;
      }
      .description-text {
        padding: 0.5em 0;
        font-weight: normal;
        font-style: italic;
      }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlRowComponent extends DxcComponent  {

    @Input() addRuleOpt = false;

    @Input() control:Control|any;
    @Input() style:Nullable<Record<string, any>> = null;

    @Input() collapsible = false;
    @Input() collapsed = false;

    @Output() onDryRunSuccess:EventEmitter<any> = new EventEmitter<any>();
    @Output() onDryRunFailed:EventEmitter<any> = new EventEmitter<any>();
    @Output() onScanning:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onNewRule:EventEmitter<boolean> = new EventEmitter<boolean>();


    gIcons:any = GLOBAL_ICONS;
    show = false;
    sanitizedDescription: SafeHtml = '';


    constructor(
        private _projectSvc: ProjectService,
        private _outputSvc: OutputService,
        public auditSvc: AuditService,
        private _searchSvc: SearchService,
        private _changeDetector:ChangeDetectorRef,
        private _sanitizer: DomSanitizer
    ) {
        super();
    }

    showDescription() {
        this.show = !this.show;

        if (this.show && this.control.description) {
            // Nettoyer le HTML pour ne garder que les balises de mise en forme textuelle
            this.sanitizedDescription = this._sanitizer.sanitize(1, this.sanitizeTextFormatting(this.control.description)) || '';
        }

        this._changeDetector.markForCheck();
    }

    /**
     * Nettoie le HTML pour ne garder que les balises de mise en forme textuelle sûres
     * @param html
     * @returns
     */
    private sanitizeTextFormatting(html: string): string {
        // Liste des balises autorisées pour la mise en forme textuelle
        const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        // Créer un élément temporaire pour parser le HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Fonction récursive pour nettoyer les nœuds
        const cleanNode = (node: Node): Node | null => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.cloneNode(true);
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();

                // Vérifier si la balise est autorisée
                if (allowedTags.includes(tagName)) {
                    const cleanElement = document.createElement(tagName);

                    // Copier uniquement les attributs style si nécessaire (optionnel)
                    // Ne pas copier d'autres attributs pour éviter les risques

                    // Nettoyer récursivement les enfants
                    Array.from(element.childNodes).forEach(child => {
                        const cleanChild = cleanNode(child);
                        if (cleanChild) {
                            cleanElement.appendChild(cleanChild);
                        }
                    });

                    return cleanElement;
                }

                // Si la balise n'est pas autorisée, traiter ses enfants
                const fragment = document.createDocumentFragment();
                Array.from(element.childNodes).forEach(child => {
                    const cleanChild = cleanNode(child);
                    if (cleanChild) {
                        fragment.appendChild(cleanChild);
                    }
                });
                return fragment;
            }

            return null;
        };

        // Nettoyer le contenu
        const cleanDiv = document.createElement('div');
        Array.from(tempDiv.childNodes).forEach(child => {
            const cleanChild = cleanNode(child);
            if (cleanChild) {
                cleanDiv.appendChild(cleanChild);
            }
        });

        return cleanDiv.innerHTML;
    }
}