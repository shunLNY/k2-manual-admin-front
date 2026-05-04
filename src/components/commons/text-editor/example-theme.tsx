
import styles from "./lexicalEditor.module.scss";

export default {
  code: styles.editor_code,
  heading: {
    h1: styles.editor_heading_h1,
    h2: styles.editor_heading_h2,
    h3: styles.editor_heading_h3,
    h4: styles.editor_heading_h4,
    h5: styles.editor_heading_h5,
  },
  image: styles.editor_image,
  link: styles.editor_link,
  list: {
    listitem: styles.editor_listitem,
    nested: {
      listitem: styles.editor_nested_listitem,
    },
    ol: styles.editor_list_ol,
    ul: styles.editor_list_ul,
  },
  ltr: styles.ltr,
  paragraph: styles.editor_paragraph,
  placeholder: styles.editor_placeholder,
  quote: styles.editor_quote,
  rtl: styles.rtl,
  text: {
    bold: styles.editor_text_bold,
    code: styles.editor_text_code,
    hashtag: styles.editor_text_hashtag,
    italic: styles.editor_text_italic,
    overflowed: styles.editor_text_overflowed,
    strikethrough: styles.editor_text_strikethrough,
    underline: styles.editor_text_underline,
    underlineStrikethrough: styles.editor_text_underlineStrikethrough,
  },
};
