import React, { useState, FC, FormEvent } from 'react';

const MyModal: FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleOpenTransfer = () => {
    setShowModal(true);
  };

  const handleCloseTransfer = () => {
    setShowModal(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // 在这里处理表单提交
    handleCloseTransfer();
  };

  return (
    <div>
      <button onClick={handleOpenTransfer}>Open Modal</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={handleCloseTransfer}>×</button>
            <form onSubmit={handleSubmit}>
              {/* 在这里添加表单字段 */}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyModal;