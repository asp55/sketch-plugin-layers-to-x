import sketch from 'sketch'
import {Group} from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  console.log("Start");

  const doc = sketch.getSelectedDocument()
  const selectedPage = doc.selectedPage;
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;
  const createdGroups = [];

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
	selectedLayers.forEach(e => {
		if(e.type !== "Artboard") { //can't group artboards, so skip those.
			const index = selectedPage.layers.findIndex(o=>o.id===e.id);

			const wrappingGroup = new Group({
				name: e.name,
				frame: e.frame,
			});
			selectedPage.layers.splice(index, 0, wrappingGroup);
			e.parent = wrappingGroup;
			e.frame.x = 0;
			e.frame.y = 0;
			wrappingGroup.adjustToFit();
			createdGroups.push(wrappingGroup);
		}
	})
	doc.selectedLayers = createdGroups;
    sketch.UI.message(`${createdGroups.length} groups created.`)
  }
  console.log(`${createdGroups.length} groups created.`);
}