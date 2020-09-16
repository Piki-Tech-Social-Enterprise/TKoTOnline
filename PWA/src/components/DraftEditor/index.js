import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import LoadingOverlayModal from 'components/App/LoadingOverlayModal';
import {
  EditorState,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import {
  Editor
} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const INITIAL_STATE = {
  isLoading: true,
  content: '',
  onChange: null,
  uploadCallback: null,
  contentFieldName: '',
  editorState: EditorState.createEmpty()
};
const DraftEditor = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    onChange,
    uploadCallback,
    contentFieldName,
    editorState
  } = state;
  const handleEditorStateChange = editorState => {
    const newContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    setState(s => ({
      ...s,
      content: newContent,
      editorState: editorState
    }));
    if (typeof onChange === 'function') {
      const e = {
        target: {
          name: contentFieldName,
          value: newContent
        }
      };
      onChange(e);
    }
  };
  useEffect(() => {
    const {
      content,
      onChange,
      uploadCallback,
      contentFieldName
    } = props;
    setState(s => ({
      ...s,
      isLoading: false,
      content,
      onChange,
      uploadCallback,
      contentFieldName,
      editorState: content && content.startsWith('{') && content.endsWith('}') && content !== s.content
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(content)))
        : s.editorState
    }));
    return () => { };
  }, [props]);
  return (
    <>
      {
        isLoading
          ? <LoadingOverlayModal />
          : <>
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorStateChange}
              toolbar={{
                image: {
                  previewImage: true,
                  uploadCallback: uploadCallback
                }
              }}
            />
          </>
      }
    </>
  );
};

DraftEditor.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  uploadCallback: PropTypes.func.isRequired,
  contentFieldName: PropTypes.string
};
DraftEditor.defaultProps = {
  contentFieldName: 'content'
};

export default DraftEditor;
