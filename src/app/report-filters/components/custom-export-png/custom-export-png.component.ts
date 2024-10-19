import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as d3Png from 'save-svg-as-png';
import * as d3 from 'd3';

@Component({
  selector: 'app-custom-export-png',
  templateUrl: './custom-export-png.component.html',
  styleUrls: ['./custom-export-png.component.scss']
})
export class CustomExportPngComponent implements OnInit {

  @Input() svgId = 'svg';
  @Input() pngName = 'Chart';
  @Input() chartTitle = 'Title';
  @Output() toggleLoader = new EventEmitter();
  @Input() latestVersion:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ExportPNG() {

    this.toggleLoader.emit(true);

    const svgNodeContainer = document.getElementById(this.svgId);
    if (svgNodeContainer === undefined || svgNodeContainer === null) {
      this.toggleLoader.emit(false);
      return;
    }

    const svgExist = document.getElementById(this.svgId).getElementsByTagName('svg');
    if (svgExist === undefined || svgExist === null || svgExist.length <= 0) {
      this.toggleLoader.emit(false);
      return;
    }

    const classFound = svgNodeContainer.getAttribute('class').indexOf('d-none');

    const chart = document.getElementById(this.svgId).getElementsByTagName('svg')[0];
    const newWidth = chart.width.baseVal.value;
    const newHeight = chart.height.baseVal.value + 70;

    let capturedSvgHtml = '';
    if (classFound <= -1) {
      capturedSvgHtml = `<g transform="translate(0,30)">
        ${chart.innerHTML}
      </g>`;
    } else {
      capturedSvgHtml = `<g style="transform: translate(${(newWidth / 2) - 50}px, ${newHeight / 2}px);">
        <text style="
          font-size: 0.72rem;
          fill: gray !important;
          font-weight: 700 !important;
          font-family: OpenSans !important;"
          text-anchor="start" x="0" y="0">No Data Found</text>
      </g>`;
    }

    let exportSvg = `

    <svg width="${newWidth}" height="${newHeight}">
      <g style="transform: translate(5px, 20px);">
        <text 
        style="
          font-size: 0.72rem;
          fill: gray !important;
          font-weight: 700 !important;
          font-family: OpenSans !important;"
          text-anchor="start" x="0" y="0">${this.chartTitle}</text>
      </g>
      <g>
        <rect stroke="black" stroke-width="1.5px" fill="transparent" x="0" y="0" width="${newWidth}" height="${newHeight}">
        </rect>
      </g>

      ${capturedSvgHtml}

      <g style="transform: translate(${newWidth - 85}px, ${newHeight - 24}px)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 142.87 28" height="28px" width="80px">
          <defs>
            <style>
              .cls-1 {
                fill: #1d1d1b;
              }
            </style>
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path class="cls-1"
                d="M138.75,11.39a10.25,10.25,0,0,0-7.34-7.29V0a14.29,14.29,0,0,1,11.45,11.4Zm-7.33,12.52a10.28,10.28,0,0,0,7.34-7.32l4.11-.06A14.28,14.28,0,0,1,131.42,28ZM126.31,28a14.26,14.26,0,0,1-11.44-11.45H119a10.29,10.29,0,0,0,7.32,7.34ZM114.87,11.45A14.25,14.25,0,0,1,126.29,0V4.1A10.28,10.28,0,0,0,119,11.4Z" />
              <path class="cls-1"
                d="M17.86,6V22.27H13.33v-2.1A6.25,6.25,0,0,1,8,22.79c-4.54,0-8-3.67-8-8.65S3.41,5.53,7.9,5.53a6.57,6.57,0,0,1,5.39,2.62V6ZM9.25,9.65a4.53,4.53,0,1,0,4.53,4.53A4.52,4.52,0,0,0,9.25,9.65" />
              <path class="cls-1"
                d="M26.74,6V8.15a5.83,5.83,0,0,1,5.09-2.51,6.07,6.07,0,0,1,4.68,2c1,1.12,1.31,2.25,1.31,4.49V22.27H33.29V13.39c0-2.92-.86-4-3.11-4S26.74,10.81,26.74,14v8.28H22.21V6Z" />
              <path class="cls-1"
                d="M54.3,11a5.22,5.22,0,0,0-3.67-1.5A4.57,4.57,0,0,0,46,14.18a4.55,4.55,0,0,0,4.64,4.72,5,5,0,0,0,3.71-1.54v4.46a9,9,0,0,1-4.16.94,8.54,8.54,0,0,1-8.87-8.5,8.69,8.69,0,0,1,8.95-8.73,8.37,8.37,0,0,1,4.08,1Z" />
              <path class="cls-1"
                d="M61.57,15c.07,2.84,1.46,4.38,4,4.38a4.19,4.19,0,0,0,3.82-2.21l4.19.67c-1.35,3.3-4.12,5-7.9,5-5.32,0-8.76-3.33-8.76-8.54s3.29-8.72,8.46-8.72,8.35,3.33,8.35,8.8V15ZM65.5,8.82a3.69,3.69,0,0,0-3.78,3.26h7.64A3.74,3.74,0,0,0,65.5,8.82" />
              <path class="cls-1"
                d="M81.75,6V8.64a5.13,5.13,0,0,1,4.72-3,4.49,4.49,0,0,1,2,.41l-.64,4.27a3.53,3.53,0,0,0-2.17-.6c-2.62,0-3.9,1.57-3.9,4.91v7.6H77.18V6Z" />
              <path class="cls-1"
                d="M107.67,6V22.27h-4.53v-2.1a6.25,6.25,0,0,1-5.36,2.62c-4.53,0-8-3.67-8-8.65s3.41-8.61,7.91-8.61a6.57,6.57,0,0,1,5.39,2.62V6ZM99.05,9.65a4.53,4.53,0,1,0,4.54,4.53,4.52,4.52,0,0,0-4.54-4.53" />
            </g>
          </g>
        </svg>
      </g>
      <g style="transform: translate(5px, ${newHeight - 5}px);">
      <text style="
        font-size: 8px;fill: gray !important;
        font-family: OpenSans !important;"
        text-anchor="start" x="0" y="0">
        Copyright &#169; 2020. All rights reserved.</text>
      </g>
    </svg>

    `;

    let options = {};
    options['backgroundColor'] = '#ffffff';
    options['selectorRemap'] = function(s) { return s.replace(/\.dc-chart/g, ''); };
    options['scale'] = 2;
    options['height'] = newHeight;
    options['width'] = newWidth;

    const d = new Date();
    const timeStamp = ' - ' + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) +
                      ('0' + d.getDate()).slice(-2) + '_' + ('0' + d.getHours()).slice(-2) + '' + ('0' + d.getMinutes()).slice(-2);
    this.pngName = this.pngName;

    const div = document.createElement('div');
    div.style.display = 'none';
    div.setAttribute('id', 'div-export-png');
    div.setAttribute('class', 'dc-chart');
    div.innerHTML = exportSvg;
    document.body.appendChild(div);
    // d3.select('#div-export-png').selectAll('path.line').style('fill', 'none');
    const elementForPNG = document.getElementById('div-export-png').getElementsByTagName('svg')[0];
    d3Png.saveSvgAsPng(elementForPNG, this.pngName + timeStamp, options);

    document.getElementById('div-export-png').remove();

    this.toggleLoader.emit(false);
    // NEW #END


  }


}
