import sketch from 'sketch'
import {Artboard, SymbolMaster} from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  console.log("Start");

  const doc = sketch.getSelectedDocument()
  const selectedPage = doc.selectedPage;
  const selectedLayers = doc.selectedLayers;
  const selectedCount = selectedLayers.length;
  const artboards = [];
  const skipped = [];

  if (selectedCount === 0) {
    sketch.UI.message('No layers are selected.')
  } else {
	selectedLayers.forEach(e => {
		if(e.parent.type == "Page") {
			if(e.type !== "SymbolMaster" && e.type !== "Artboard") { //If a layer isn't already an artboard, make it into one.
				const index = selectedPage.layers.findIndex(o=>o.id===e.id);

				const wrappingBoard = new Artboard({
					name: e.name,
					frame: e.frame,
				});
				selectedPage.layers.splice(index, 0, wrappingBoard);
				e.parent = wrappingBoard;
				e.frame.x = 0;
				e.frame.y = 0;
				artboards.push(wrappingBoard);
			}
			else if(e.type == "Artboard") {
				artboards.push(e);
			}
		}
		else {
			skipped.push(e);
		}
	})

	doc.selectedLayers = skipped;

	artboards.forEach(a => {
		SymbolMaster.fromArtboard(a);
	});

    if(skipped.length > 0) {
    	sketch.UI.message(`${artboards.length} symbols created.\n${skipped.length} layers skipped. I can only make symbols out of layers that are not inside of groups or artboards.`);
    }
    else {
    	sketch.UI.message(`${artboards.length} symbols created.`);
    }
  }
}