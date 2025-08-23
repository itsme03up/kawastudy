// Entry point for teacherstudy React page
import React from 'react';
import { Button } from 'react-bootstrap';

const TeacherStudy = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4">Teacher Study Page</h1>
      <div className="d-flex justify-content-center">
        <Button 
          variant="primary"
          size="lg"
          href="/teacherstudy"
          className="shadow-sm px-4"
        >
          教師向け学習コンテンツへ
        </Button>
      </div>
      {/* 他のコンテンツをここに追加 */}
    </div>
  );
};

export default TeacherStudy;
