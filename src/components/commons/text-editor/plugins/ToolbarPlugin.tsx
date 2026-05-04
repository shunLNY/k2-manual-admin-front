import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../lexicalEditor.module.scss'; // ✅ Import your SCSS module
import { IconArrowClockWise, IconArrowCounterClockWise, IconJustify, IconTextCenter, IconTextLeft, IconTextRight, IconTypeBold, IconTypeItalic, IconTypeStrikeThrough, IconTypeUnderLine } from '@/components/icons/icons';
import classNames from 'classnames';

function Divider() {
  return <div className={styles.divider} />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <div className={styles.toolbar} ref={toolbarRef}>
      
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={`${styles.toolbar_item} ${styles.spaced}`}
        aria-label="Undo"
      >
        <IconArrowClockWise />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className={`${styles.toolbar_item} ${styles.spaced}`}
        aria-label="Redo"
      >
        <IconArrowCounterClockWise />
      </button>

      <Divider />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`${styles.toolbar_item} ${styles.spaced} ${isBold ? styles.active : ''}`}
        aria-label="Format Bold"
      >

        <IconTypeBold />

      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`${styles.toolbar_item} ${styles.spaced} ${isItalic ? styles.active : ''}`}
        aria-label="Format Italic"
      >

        <IconTypeItalic />

      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`${styles.toolbar_item} ${styles.spaced} ${isUnderline ? styles.active : ''}`}
        aria-label="Format Underline"
      >

        <IconTypeUnderLine />


      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={`${styles.toolbar_item} ${styles.spaced} ${isStrikethrough ? styles.active : ''}`}
        aria-label="Strikethrough"
      >
        <IconTypeStrikeThrough />
      </button>

      <Divider />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className={`${styles.toolbar_item} ${styles.spaced}`}
        aria-label="Left Align"
      >
        <IconTextLeft />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className={`${styles.toolbar_item} ${styles.spaced}`}
        aria-label="FormatCenter Align"
      >

        <IconTextCenter />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className={`${styles.toolbar_item} ${styles.format} ${styles.spaced}`}
        aria-label="Format Right Align"
      >
        <IconTextRight />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        className={styles.toolbar_item}
        aria-label="Format Justify"
      >
        <IconJustify />
      </button>
    </div>
  );
}
