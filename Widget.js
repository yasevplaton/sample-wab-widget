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
define(["dojo/_base/declare", "jimu/BaseWidget"], function (
  declare,
  BaseWidget
) {
  var clazz = declare([BaseWidget], {
    baseClass: "jimu-test-best-widget",
    events: [],

    postCreate: function () {
      this.inherited(arguments);
      const rect = this.userLink.getBoundingClientRect();
      console.log(rect);
    },

    startup: function () {
      const rect = this.userLink.getBoundingClientRect();
      console.log(rect);
    },

    _getMapId: function () {
      alert(this.map.id);
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
