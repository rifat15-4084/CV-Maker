import { beforeEach, describe, expect, it } from "vitest";
import { useEditorStore } from "./editor-store";
import { createEmptyCVData } from "@/lib/cv/defaults";
import { createSampleCVData } from "@/lib/cv/sample-data";

function reset() {
  useEditorStore.getState().initialize({
    cvId: "cv-1",
    templateId: "aurora",
    title: "Test CV",
    data: createEmptyCVData(),
  });
}

describe("editor store", () => {
  beforeEach(reset);

  it("initializes with the supplied document", () => {
    const state = useEditorStore.getState();
    expect(state.cvId).toBe("cv-1");
    expect(state.templateId).toBe("aurora");
    expect(state.title).toBe("Test CV");
    expect(state.saveStatus).toBe("saved");
  });

  it("marks the document dirty and bumps the change token on update", () => {
    const before = useEditorStore.getState().changeToken;
    useEditorStore.getState().update((draft) => {
      draft.personal.firstName = "Ada";
    });
    const state = useEditorStore.getState();
    expect(state.data.personal.firstName).toBe("Ada");
    expect(state.saveStatus).toBe("dirty");
    expect(state.changeToken).toBe(before + 1);
  });

  it("supports undo and redo of whole-document snapshots", () => {
    const store = useEditorStore.getState();
    store.update((draft) => {
      draft.personal.firstName = "Ada";
    });
    store.update((draft) => {
      draft.personal.lastName = "Lovelace";
    });

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().data.personal.lastName).toBe("");
    expect(useEditorStore.getState().data.personal.firstName).toBe("Ada");

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().data.personal.firstName).toBe("");

    useEditorStore.getState().redo();
    expect(useEditorStore.getState().data.personal.firstName).toBe("Ada");
  });

  it("clears the redo stack once a new edit is made", () => {
    const store = useEditorStore.getState();
    store.update((draft) => {
      draft.personal.firstName = "Ada";
    });
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().canRedo()).toBe(true);

    useEditorStore.getState().update((draft) => {
      draft.personal.firstName = "Grace";
    });
    expect(useEditorStore.getState().canRedo()).toBe(false);
  });

  it("does not push history when asked not to", () => {
    const before = useEditorStore.getState().past.length;
    useEditorStore.getState().update(
      (draft) => {
        draft.personal.email = "a@b.com";
      },
      { history: false },
    );
    expect(useEditorStore.getState().past.length).toBe(before);
  });

  it("loads sample data and can undo back to empty", () => {
    useEditorStore.getState().loadSample(createSampleCVData());
    expect(useEditorStore.getState().data.personal.firstName).not.toBe("");

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().data.personal.firstName).toBe("");
  });

  it("keeps appearance settings when resetting to empty", () => {
    useEditorStore.getState().setAccent("#ff00ff");
    useEditorStore.getState().setFont("playfair");
    useEditorStore.getState().update((draft) => {
      draft.summary = "Something";
    });

    useEditorStore.getState().resetToEmpty();
    const state = useEditorStore.getState();
    expect(state.data.summary).toBe("");
    expect(state.data.settings.accent).toBe("#ff00ff");
    expect(state.data.settings.font).toBe("playfair");
  });

  it("toggles section visibility through the settings blob", () => {
    useEditorStore.getState().toggleSection("hobbies", false);
    expect(useEditorStore.getState().data.settings.sectionVisibility.hobbies).toBe(false);
  });

  it("tracks save status transitions", () => {
    useEditorStore.getState().setSaveStatus("saving");
    expect(useEditorStore.getState().saveStatus).toBe("saving");
    useEditorStore.getState().markSaved(1234);
    const state = useEditorStore.getState();
    expect(state.saveStatus).toBe("saved");
    expect(state.lastSavedAt).toBe(1234);
  });
});
