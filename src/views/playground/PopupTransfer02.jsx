import React, { useState, useMemo } from 'react';
import './PopupTransfer02.css';

export default function PopupTransfer02({ onClose, onSave }) {
  const initialAllItems = [
    { id: 1, name: '짬뽕' },
    { id: 2, name: '짜장면' },
    { id: 3, name: '돈까스' },
    { id: 4, name: '제육볶음' },
    { id: 5, name: '탕수육' },
    { id: 6, name: '족발' },
    { id: 7, name: '치킨' },
    { id: 8, name: '만두' },
    { id: 9, name: '햄버거' },
    { id: 10, name: '피자' },
  ];

  const [leftItems, setLeftItems] = useState([...initialAllItems]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeftItems, setSelectedLeftItems] = useState([]);
  const [selectedRightItems, setSelectedRightItems] = useState([]);

  const isAllLeftSelected = useMemo(
    () => leftItems.length > 0 && selectedLeftItems.length === leftItems.length,
    [leftItems, selectedLeftItems],
  );

  const isLeftIndeterminate = useMemo(
    () =>
      selectedLeftItems.length > 0 &&
      selectedLeftItems.length < leftItems.length,
    [leftItems, selectedLeftItems],
  );

  const isAllRightSelected = useMemo(
    () =>
      rightItems.length > 0 && selectedRightItems.length === rightItems.length,
    [rightItems, selectedRightItems],
  );

  const isRightIndeterminate = useMemo(
    () =>
      selectedRightItems.length > 0 &&
      selectedRightItems.length < rightItems.length,
    [rightItems, selectedRightItems],
  );

  const toggleSelectAllLeft = checked => {
    setSelectedLeftItems(checked ? leftItems.map(i => i.id) : []);
  };

  const toggleSelectAllRight = checked => {
    setSelectedRightItems(checked ? rightItems.map(i => i.id) : []);
  };

  const moveRight = () => {
    const itemsToMove = leftItems.filter(i => selectedLeftItems.includes(i.id));
    const remaining = leftItems.filter(i => !selectedLeftItems.includes(i.id));

    setRightItems([...rightItems, ...itemsToMove]);
    setLeftItems(remaining);
    setSelectedLeftItems([]);
  };

  const moveLeft = () => {
    const itemsToMove = rightItems.filter(i =>
      selectedRightItems.includes(i.id),
    );
    const remaining = rightItems.filter(
      i => !selectedRightItems.includes(i.id),
    );

    setLeftItems([...leftItems, ...itemsToMove]);
    setRightItems(remaining);
    setSelectedRightItems([]);
  };

  const moveRightItemUp = () => {
    setRightItems(prev => {
      const newList = [...prev];
      const selectedIdx = newList
        .map((item, idx) => (selectedRightItems.includes(item.id) ? idx : -1))
        .filter(idx => idx !== -1);

      if (selectedIdx[0] === 0) return prev;

      selectedIdx.forEach(idx => {
        const temp = newList[idx - 1];
        newList[idx - 1] = newList[idx];
        newList[idx] = temp;
      });

      return newList;
    });
  };

  const moveRightItemDown = () => {
    setRightItems(prev => {
      const newList = [...prev];
      const selectedIdx = newList
        .map((item, idx) => (selectedRightItems.includes(item.id) ? idx : -1))
        .filter(idx => idx !== -1);

      if (selectedIdx[selectedIdx.length - 1] === newList.length - 1)
        return prev;

      [...selectedIdx].reverse().forEach(idx => {
        const temp = newList[idx + 1];
        newList[idx + 1] = newList[idx];
        newList[idx] = temp;
      });

      return newList;
    });
  };

  const saveChanges = () => {
    onSave(rightItems);
    onClose();
  };

  return (
    <div
      className="popup-overlay"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="popup-wrapper">
        <div className="popup-header">
          <h2>항목 이동(일반 CSS)</h2>
          <button onClick={onClose} className="close-btn">
            X
          </button>
        </div>

        <div className="popup-body">
          {/* Left Panel */}
          <div className="panel">
            <div className="panel-header">
              <h3>소스 목록</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAllLeftSelected}
                  ref={el => el && (el.indeterminate = isLeftIndeterminate)}
                  disabled={leftItems.length === 0}
                  onChange={e => toggleSelectAllLeft(e.target.checked)}
                />
                전체 선택
              </label>
            </div>

            <div className="panel-list">
              {leftItems.map(item => (
                <div
                  key={item.id}
                  className={`list-row ${
                    selectedLeftItems.includes(item.id) ? 'row-selected' : ''
                  }`}
                >
                  <label className="row-label">
                    <input
                      type="checkbox"
                      checked={selectedLeftItems.includes(item.id)}
                      className="mr-3"
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedLeftItems([...selectedLeftItems, item.id]);
                        } else {
                          setSelectedLeftItems(
                            selectedLeftItems.filter(id => id !== item.id),
                          );
                        }
                      }}
                    />
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer Buttons */}
          <div className="transfer-buttons">
            <button
              onClick={moveRight}
              disabled={selectedLeftItems.length === 0}
            >
              &gt;
            </button>

            <button
              onClick={moveLeft}
              disabled={selectedRightItems.length === 0}
            >
              &lt;
            </button>
          </div>

          {/* Right Panel */}
          <div className="panel panel-right">
            <div className="panel-header">
              <h3>선택 목록</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isAllRightSelected}
                  ref={el => el && (el.indeterminate = isRightIndeterminate)}
                  disabled={rightItems.length === 0}
                  onChange={e => toggleSelectAllRight(e.target.checked)}
                />
                전체 선택
              </label>
            </div>

            <div className="panel-list">
              {rightItems.map(item => (
                <div
                  key={item.id}
                  className={`list-row ${
                    selectedRightItems.includes(item.id) ? 'row-selected' : ''
                  }`}
                >
                  <label className="row-label">
                    <input
                      type="checkbox"
                      checked={selectedRightItems.includes(item.id)}
                      className="mr-3"
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedRightItems([
                            ...selectedRightItems,
                            item.id,
                          ]);
                        } else {
                          setSelectedRightItems(
                            selectedRightItems.filter(id => id !== item.id),
                          );
                        }
                      }}
                    />
                    {item.name}
                  </label>
                </div>
              ))}
            </div>

            {/* Up / Down Buttons */}
            <div className="sort-buttons">
              <button
                disabled={
                  selectedRightItems.length === 0 ||
                  rightItems.findIndex(i => i.id === selectedRightItems[0]) ===
                    0
                }
                onClick={moveRightItemUp}
              >
                ▲
              </button>

              <button
                disabled={
                  selectedRightItems.length === 0 ||
                  rightItems.findIndex(
                    i =>
                      i.id ===
                      selectedRightItems[selectedRightItems.length - 1],
                  ) ===
                    rightItems.length - 1
                }
                onClick={moveRightItemDown}
              >
                ▼
              </button>
            </div>
          </div>
        </div>

        <div className="popup-footer">
          <button className="footer-btn">버튼1</button>
          <button className="footer-btn">버튼2</button>
          <button className="footer-btn">버튼3</button>
          <button className="footer-btn save-btn" onClick={saveChanges}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
