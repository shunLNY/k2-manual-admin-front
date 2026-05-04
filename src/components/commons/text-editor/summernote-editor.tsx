'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetcher } from '@/utils/fetcher';
import { API_URL } from '@/utils/constants';

// Extend the Window interface to include '$' and 'jQuery'
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
  interface JQuery {
    summernote?: any;
  }
}

interface Props {
  value?: string;
  onChange: (content: string) => void;
  toolbar?: (string | string[])[][];
}

const SummernoteEditor = ({ value, onChange, toolbar }: Props) => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  // Keep the onChange callback reference up-to-date.
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);


  useEffect(() => {
    let destroyed = false;
    const loadSummernote = async () => {
      if (typeof window !== 'undefined') {
        const $ = (await import('jquery')).default;
        (window as any).$ = (window as any).jQuery = $;

        // @ts-ignore
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        // @ts-ignore
        await import('summernote/dist/summernote-bs4.js');
        // @ts-ignore
        await import('summernote/dist/lang/summernote-ja-JP.js');

        await $('#summernote').summernote({
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
                  console.log("Inserting image:", url);
                  $('#summernote').summernote('insertImage', url);
                } else {
                  console.error("Upload failed, missing path:", data);
                }
              } catch (err) {
                console.error("Upload error", err);
              }
            }

          }

        });



      }
    };


    loadSummernote();
    setIsLoading(false);
    return () => {
      if (window.$ && $('#summernote').data('summernote')) {
        $('#summernote').summernote('destroy');
      }
    };

  }, [toolbar]);

  useEffect(() => {
    const initializeData = async () => {
      const $ = (await import('jquery')).default;
      (window as any).$ = (window as any).jQuery = $;

      // @ts-ignore
      await import('bootstrap/dist/js/bootstrap.bundle.min.js');
      // @ts-ignore
      await import('summernote/dist/summernote-bs4.js');
      // @ts-ignore
      await import('summernote/dist/lang/summernote-ja-JP.js');

      const currentCode = $('#summernote').summernote('code');
      if (currentCode !== value) {
        $('#summernote').summernote('code', value);
      }
    };

    initializeData();
  }, [value]);


  return (
    <div className="container mt-4">
      <textarea id="summernote" />
    </div>
  );
};

export default dynamic(() => Promise.resolve(SummernoteEditor), { ssr: false });
