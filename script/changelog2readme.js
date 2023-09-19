const fs = require('fs');
const readmePath = 'README.md';
const changelogPath = 'CHANGELOG.md'
const changelogExists = fs.existsSync(changelogPath);

if(!changelogExists) return console.log('changelog.md do not exit, skip..')

// 读取 CHANGELOG.md 文件的内容
const changelog = fs.readFileSync(changelogPath, 'utf8');

// 读取 README.md 文件的内容
let readme = fs.readFileSync(readmePath, 'utf8');



// 检查 README.md 中是否已经包含 Changelog 标记
const changelogMarker = '# Changelog';
const changelogMarkerIndex = readme.indexOf(changelogMarker);

// 更新 README.md 中的 Changelog
if (changelogMarkerIndex !== -1) {
  // 替换现有的 Changelog 部分
  const readmeBeforeChangelog = readme.slice(0, changelogMarkerIndex);
  const readmeAfterChangelog = readme.slice(changelogMarkerIndex, readmeBeforeChangelog[readmeBeforeChangelog.length -1]);
  const newReadme = `${readmeBeforeChangelog}# Changelog\n\n${changelog}\n\n`;
  readme = `${newReadme}${readmeAfterChangelog}`;
} else {
  // 追加新的 Changelog 部分
  readme = `${readme}\n\n# Changelog\n\n${changelog}\n\n`;
}

// 保存更新后的 README.md 文件
fs.writeFileSync(readmePath, readme);