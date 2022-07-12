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
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/geometry/Polygon",
  "esri/layers/GraphicsLayer",
], function (
  declare,
  BaseWidget,
  Query,
  QueryTask,
  Graphic,
  SFS,
  Polygon,
  GraphicsLayer
) {
  var clazz = declare([BaseWidget], {
    baseClass: "jimu-test-best-widget",
    events: [],
    countriesLayerUrl: "",
    selected: false,
    selectedLayer: null,

    postCreate: function () {
      this.inherited(arguments);
      const countriesLayerId = this.map.graphicsLayerIds.find((lid) => {
        const layer = this.map.getLayer(lid);
        return layer.name === "Countries - countries 0";
      });
      if (countriesLayerId) {
        this.countriesLayerUrl = this.map.getLayer(countriesLayerId).url;
        this.selectedLayer = new GraphicsLayer({ id: "selectedLayer" });
        this.map.addLayer(this.selectedLayer);
      }
    },

    _getMapId: function () {
      alert(this.map.id);
    },

    selectTopPopulationCountries: function () {
      if (!this.countriesLayerUrl || this.selected) return;

      const queryTask = new QueryTask(this.countriesLayerUrl);
      const query = new Query();
      query.where = "1=1";
      query.outFields = ["NAME", "POP_EST"];
      query.returnGeometry = true;
      query.orderByFields = ["POP_EST DESC"];
      queryTask.on("complete", (result) => {
        const { features } = result.featureSet;
        const top5Features = features.slice(0, 4);
        top5Features.forEach((f) => {
          const polygon = new Polygon(f.geometry);
          this.selectedLayer.add(new Graphic(polygon, new SFS(), f.attributes));
        });
        this.selected = true;
      });
      queryTask.execute(query);
    },

    onOpen() {
      console.log("open");
      console.log(this);
      const clickEvent = this.map.on("click", (event) => {
        console.log("click");
        const { mapPoint } = event;
        this.coordBlock.innerText = `X: ${mapPoint.x}, Y: ${mapPoint.y}`;
      });
      this.events.push(clickEvent);
    },

    onClose() {
      console.log("close");
      this.events.forEach((ev) => ev.remove());
      this.events = [];
    },
  });
  return clazz;
});
