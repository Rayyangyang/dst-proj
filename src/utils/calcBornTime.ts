export function calcBornTime(IdCard: number, type) {
  if (type === 1) {
    //获取出生日期
    const birthday: string =
      IdCard.substring(6, 10) + '-' + IdCard.substring(10, 12) + '-' + IdCard.substring(12, 14);
    return birthday;
  }
  if (type === 2) {
    //获取性别
    if (parseInt(IdCard.substr(16, 1)) % 2 === 1) {
      return '男';
    } else {
      return '女';
    }
  }
  if (type === 3) {
    //获取年龄
    const ageDate = new Date();
    const month = ageDate.getMonth() + 1;
    const day = ageDate.getDate();
    let age = ageDate.getFullYear() - IdCard.substring(6, 10) - 1;
    console.log(111, age)
    if (
      IdCard.substring(10, 12) < month ||
      (IdCard.substring(10, 12) === month && IdCard.substring(12, 14) <= day)
    ) {
      age++;
    }
    if (age <= 0) {
      age = 1;
    }
    return age;
  }
}
