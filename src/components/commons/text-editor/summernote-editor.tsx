'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { fetcher } from '@/utils/fetcher';
import { API_URL } from '@/utils/constants';

// Summernote Lite is standalone and works best with Bootstrap 5
import 'summernote/dist/summernote-lite.css';

// Extend the Window interface for jQuery globals
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

interface Props {
  value?: string;
  onChange: (content: string) => void;
  toolbar?: (string | string[])[][];
}

const SummernoteEditor = ({ value, onChange, toolbar }: Props) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const isInitialized = useRef(false);
  const onChangeRef = useRef(onChange);

  // Keep the onChange callback reference up-to-date without re-initializing the editor
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const loadSummernote = async () => {
      if (typeof window !== 'undefined') {
        const $ = (await import('jquery')).default;
        window.$ = window.jQuery = $;

        // Import Summernote Lite JS (Bootstrap 5 compatible)
        // @ts-ignore
        await import('summernote/dist/summernote-lite.js');
        // @ts-ignore
        await import('summernote/dist/lang/summernote-ja-JP.js');

        if (editorRef.current && !isInitialized.current) {
          const $editor = $(editorRef.current);
          
          ($editor as any).summernote({
            placeholder: '本文を入力してください',
            tabsize: 2,
            height: 300,
            lang: 'ja-JP',
            toolbar: toolbar || [
              ['style', ['style']],
              ['font', ['bold', 'italic', 'underline', 'clear']],
              ['fontname', ['fontname']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['table', ['table']],
              ['insert', ['link', 'picture', 'video']],
              ['view', ['fullscreen', 'codeview', 'help']],
            ],
            callbacks: {
              onChange: (contents: string) => {
                onChangeRef.current(contents);
              },
              onImageUpload: async (files: File[]) => {
                try {
                  const formData = new FormData();
                  formData.append('thumbnail_path', files[0]);

                  const data = await fetcher('/api/proxy/files/_tmp/image/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  if (data?.path) {
                    const url = `${API_URL.replace(/\/$/, '')}${data.path}`;
                    $editor.summernote('insertImage', url);
                  }
                } catch (err) {
                  console.error("Upload error", err);
                }
              }
            }
          });

          if (value) {
            $editor.summernote('code', value);
          }
          isInitialized.current = true;
        }
      }
    };

    loadSummernote();

    return () => {
      if (isInitialized.current && editorRef.current && window.$) {
        window.$(editorRef.current).summernote('destroy');
        isInitialized.current = false;
      }
    };
  }, [toolbar]);

  // Synchronize internal state with value prop when it changes externally
  useEffect(() => {
    if (isInitialized.current && editorRef.current && window.$) {
      const $editor = window.$(editorRef.current);
      const currentCode = $editor.summernote('code');
      if (currentCode !== value) {
        $editor.summernote('code', value || '');
      }
    }
  }, [value]);

  return (
    <div className="summernote-editor-container">
      <textarea ref={editorRef} style={{ display: 'none' }} />
    </div>
  );
};

export default dynamic(() => Promise.resolve(SummernoteEditor), { ssr: false });
