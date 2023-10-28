import React, { useState } from 'react';

const MyTokens2 = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里处理表单提交
    handleCloseModal();
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Open Modal</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>×</span>
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

export default MyTokens2;
