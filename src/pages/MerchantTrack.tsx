import React, { useState } from 'react';

const MyModal = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenTransfer = () => {
    setShowModal(true);
  };

  const handleCloseTransfer = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里处理表单提交
    handleCloseModal();
  };

  return (
    <div>
      <button onClick={handleOpenTransfer}>Open Modal</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={handleCloseModal}>×</button>
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
