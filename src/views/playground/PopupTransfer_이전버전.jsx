import React, { useState, useMemo } from 'react';

export default function PopupTransfer({ onClose, onSave }) {
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

  /** -----------------------------
   * 체크박스 관련 계산
   -------------------------------*/
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

  /** -----------------------------
   * 전체 선택(좌/우)
   -------------------------------*/
  const toggleSelectAllLeft = checked => {
    setSelectedLeftItems(checked ? leftItems.map(i => i.id) : []);
  };

  const toggleSelectAllRight = checked => {
    setSelectedRightItems(checked ? rightItems.map(i => i.id) : []);
  };

  /** -----------------------------
   * 좌 → 우 이동
   -------------------------------*/
  const moveRight = () => {
    const itemsToMove = leftItems.filter(i => selectedLeftItems.includes(i.id));
    const remaining = leftItems.filter(i => !selectedLeftItems.includes(i.id));

    setRightItems([...rightItems, ...itemsToMove]);
    setLeftItems(remaining);
    setSelectedLeftItems([]);
  };

  /** -----------------------------
   * 우 → 좌 이동
   -------------------------------*/
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

  /** -----------------------------
   * 우측 목록 정렬 - 위로 이동
   -------------------------------*/
  const moveRightItemUp = () => {
    setRightItems(prev => {
      const newList = [...prev];

      // 선택된 인덱스
      const selectedIdx = newList
        .map((item, idx) => (selectedRightItems.includes(item.id) ? idx : -1))
        .filter(idx => idx !== -1);

      if (selectedIdx[0] === 0) return prev; // 맨 위면 이동 불가

      // 위로 이동 (위에서 아래 순)
      selectedIdx.forEach(idx => {
        const temp = newList[idx - 1];
        newList[idx - 1] = newList[idx];
        newList[idx] = temp;
      });

      return newList;
    });
  };

  /** -----------------------------
   * 우측 목록 정렬 - 아래로 이동
   -------------------------------*/
  const moveRightItemDown = () => {
    setRightItems(prev => {
      const newList = [...prev];

      const selectedIdx = newList
        .map((item, idx) => (selectedRightItems.includes(item.id) ? idx : -1))
        .filter(idx => idx !== -1);

      if (selectedIdx[selectedIdx.length - 1] === newList.length - 1)
        return prev; // 맨 아래면 이동 불가

      // 아래로 이동 (아래에서 위 순)
      [...selectedIdx].reverse().forEach(idx => {
        const temp = newList[idx + 1];
        newList[idx + 1] = newList[idx];
        newList[idx] = temp;
      });

      return newList;
    });
  };

  /** -----------------------------
   * 저장
   -------------------------------*/
  const saveChanges = () => {
    onSave(rightItems);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white p-5 rounded-lg w-[750px] shadow-lg flex flex-col animate-scaleIn">
        <div className="flex justify-between items-center border-b pb-2 mb-3">
          <h2 className="text-xl font-semibold">항목 이동</h2>
          <button className="text-xl" onClick={onClose}>
            X
          </button>
        </div>

        <div className="flex justify-between flex-grow">
          {/* Left Panel */}
          <div className="w-[45%]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">소스 목록</h3>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={isAllLeftSelected}
                  ref={el => el && (el.indeterminate = isLeftIndeterminate)}
                  disabled={leftItems.length === 0}
                  onChange={e => toggleSelectAllLeft(e.target.checked)}
                  className="mr-1"
                />
                전체 선택
              </label>
            </div>

            <div className="border rounded p-2 min-h-[200px] max-h-[300px] overflow-y-auto">
              {leftItems.map(item => (
                <div key={item.id} className="py-2 border-b last:border-none">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLeftItems.includes(item.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedLeftItems([...selectedLeftItems, item.id]);
                        } else {
                          setSelectedLeftItems(
                            selectedLeftItems.filter(id => id !== item.id),
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    {item.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer Buttons */}
          <div className="flex flex-col gap-3 mx-5 my-auto">
            <button
              onClick={moveRight}
              disabled={selectedLeftItems.length === 0}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              &gt;
            </button>

            <button
              onClick={moveLeft}
              disabled={selectedRightItems.length === 0}
              className="px-3 py-2 border rounded disabled:opacity-40"
            >
              &lt;
            </button>
          </div>

          {/* Right Panel */}
          <div className="w-[45%] flex gap-2">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">선택 목록</h3>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={isAllRightSelected}
                    ref={el => el && (el.indeterminate = isRightIndeterminate)}
                    disabled={rightItems.length === 0}
                    onChange={e => toggleSelectAllRight(e.target.checked)}
                    className="mr-1"
                  />
                  전체 선택
                </label>
              </div>

              <div className="border rounded p-2 min-h-[200px] max-h-[300px] overflow-y-auto">
                {rightItems.map(item => (
                  <div key={item.id} className="py-2 border-b last:border-none">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRightItems.includes(item.id)}
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
                        className="mr-2"
                      />
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Up / Down Buttons */}
            <div className="flex flex-col gap-2">
              <button
                className="px-3 py-2 border rounded disabled:opacity-40"
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
                className="px-3 py-2 border rounded disabled:opacity-40"
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

        <div className="text-right border-t pt-3 mt-3">
          <button className="px-5 py-2 border rounded" onClick={saveChanges}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
