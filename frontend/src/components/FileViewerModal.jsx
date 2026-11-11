import { backendFetch } from '../config/api';
import './FileViewerModal.css';

// Private files can't be linked to directly: load them with the session cookie and show them
// from a blob: URL. Resolves to { url, type }; the caller passes it to <FileViewerModal> and
// must revoke the URL when done (the modal's onClose does it).
export const loadPrivateFile = async (endpoint) => {
  const response = await backendFetch(endpoint);
  if (!response.ok) throw new Error(`Could not load file (${response.status})`);
  const blob = await response.blob();
  return { url: URL.createObjectURL(blob), type: blob.type };
};

const FileViewerModal = ({ file, title, onClose }) => {
  if (!file) return null;

  const close = () => {
    URL.revokeObjectURL(file.url);
    onClose();
  };

  return (
    <div className="image-modal-overlay" onClick={close}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <button className="close-modal-btn" onClick={close} aria-label="Close">×</button>
        {file.type === 'application/pdf'
          ? <iframe src={file.url} title={title} className="file-pdf" />
          : <img src={file.url} alt={title} />}
      </div>
    </div>
  );
};

export default FileViewerModal;
