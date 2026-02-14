// 프로젝트 초기 설정 검증 테스트
describe('프로젝트 설정 검증', () => {
  it('Jest가 정상적으로 동작한다', () => {
    expect(1 + 1).toBe(2);
  });

  it('fast-check이 정상적으로 로드된다', () => {
    const fc = require('fast-check');
    expect(fc).toBeDefined();
    expect(fc.integer).toBeDefined();
  });
});
