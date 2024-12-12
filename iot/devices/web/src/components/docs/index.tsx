/** @format */
import { useRef, useState } from 'preact/hooks';
import { useEffect } from 'react';

import { mergeJson } from '../../common/json';
import styles from './styles.module.scss';

export const Docs: React.FunctionComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [schemaProgress, setSchemaProgress] = useState(0);
  const [schemaCount, setSchemaCount] = useState(0);

  useEffect(() => {
    (async () => {
      const urls = [
        `http://${window.deviceIp}/docs/schema`,
        ...Object.keys(window.sources).map((id) => `http://${window.deviceIp}/${id}/schema`),
      ];
      setSchemaCount(urls.length);
      let schema = {};
      let i = 0;
      for (const url of urls) {
        schema = mergeJson(
          schema,
          await fetch(url)
            .then((response) => {
              if (response.status !== 200) return {};
              return response.json();
            })
            .catch(() => ({}))
        );
        i++;
        setSchemaProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      console.log(schema);
      window.Redoc.init(schema, {}, elementRef.current);
    })();
  }, [setSchemaCount, setSchemaProgress]);

  return (
    <div className={styles.docs} ref={elementRef}>
      Loaded {schemaProgress}/{schemaCount} schemas...
    </div>
  );
};
