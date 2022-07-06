///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
  "dojo/_base/declare",
  "jimu/BaseWidget",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Point",
  "./Utils",
], function (declare, BaseWidget, wmUtils, Point, utils) {
  var clazz = declare([BaseWidget], {
    baseClass: "jimu-test-best-widget",
    events: [],
    postCreate: function () {
      this.inherited(arguments);
      this.userLink.setAttribute("href", this.config.link);
    },

    _getMapId: function () {
      alert(this.map.id);
    },

    onOpen() {
      const clickEvent = this.map.on("click", (event) => {
        console.log(event);
        const { mapPoint } = event;
        const point = new Point(mapPoint);
        const latLonPoint = wmUtils.webMercatorToGeographic(point);
        const lon = utils.round(latLonPoint.x, 100);
        const lat = utils.round(latLonPoint.y, 100);
        this.coordBlock.innerText = `Lon: ${lon}, Lat: ${lat}`;
      });
      this.events.push(clickEvent);
    },

    onClose() {
      this.resetEvents();
    },

    resetEvent() {
      this.events.forEach((ev) => ev.remove());
      this.events = [];
    },
  });
  return clazz;
});
