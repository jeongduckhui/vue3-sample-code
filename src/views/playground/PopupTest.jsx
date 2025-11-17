import React, { useState } from 'react';
import PopupTransfer from './PopupTransfer';

export default function PopupTest() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleUpdateItems = items => {
    setSelectedItems(items);
  };

  return (
    <div className="p-5">
      {/* Portal 영역 */}
      {isPopupOpen && (
        <div id="modal-root">
          <PopupTransfer onClose={closePopup} onSave={handleUpdateItems} />
        </div>
      )}

      <button
        onClick={openPopup}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        팝업 열기
      </button>

      {/* 선택된 결과 출력 (테스트용) */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">선택된 항목:</h3>
        <ul className="list-disc ml-6">
          {selectedItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
