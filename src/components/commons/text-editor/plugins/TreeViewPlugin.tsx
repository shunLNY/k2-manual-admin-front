/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
import styles from '../lexicalEditor.module.scss';

export default function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName={styles.tree_view_output}
      treeTypeButtonClassName={styles.debug_treetype_button}
      timeTravelPanelClassName={styles.debug_timetravel_panel}
      timeTravelButtonClassName={styles.debug_timetravel_button}
      timeTravelPanelSliderClassName={styles.debug_timetravel_panel_slider}
      timeTravelPanelButtonClassName={styles.debug_timetravel_panel_button}
      editor={editor}
    />
  );
}
