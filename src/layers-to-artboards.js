import sketch from 'sketch'
import {Artboard} from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  console.log("Start");

  const doc = sketch.getSelectedDocument()
  const selectedPage = doc.selectedPage;
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;
  const createdArtboards = [];
  const alreadyArtboards = [];
  const skipped = [];

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
	selectedLayers.forEach(e => {
		if(e.parent.type == "Page") {
			if(e.type !== "Artboard") { //Skip any layers that are already artboards
				const index = selectedPage.layers.findIndex(o=>o.id===e.id);

				const wrappingBoard = new Artboard({
					name: e.name,
					frame: e.frame,
				});
				selectedPage.layers.splice(index, 0, wrappingBoard);
				e.parent = wrappingBoard;
				e.frame.x = 0;
				e.frame.y = 0;
				createdArtboards.push(wrappingBoard);
			}
			else {
				alreadyArtboards.push(e);
			}
		}
		else {
			console.log("Not on a page");
			skipped.push(e);
		}
	})
	doc.selectedLayers = [...createdArtboards, ...alreadyArtboards, ...skipped];

    if(skipped.length > 0) {
    	sketch.UI.message(`${createdArtboards.length} artboards created. ${skipped.length} layers skipped. Can't make an artboard on an artboard.`);
    }
    else { 
    	sketch.UI.message(`${createdArtboards.length} artboards created.`);
  	}
  }
}