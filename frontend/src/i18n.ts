import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define resources
const resources = {
  en: {
    translation: {
      "app.title": "My Tasks",
      "stats.pending": "{{count}} pending",
      "stats.completed": "{{count}} completed",
      "form.add.placeholder.title": "Task title...",
      "form.add.placeholder.content": "Details (optional)...",
      "form.add.button.adding": "Adding...",
      "form.add.button.default": "Add Task",
      "list.empty": "No tasks yet. Add one above!",
      "action.delete.confirm": "Confirm delete?",
      "action.archive.button": "Archive Completed Tasks",
      "action.archive.confirm": "Archive all completed tasks?",
      "action.delete.title": "Delete"
    }
  },
  zh: {
    translation: {
      "app.title": "我的任务",
      "stats.pending": "{{count}} 个待办",
      "stats.completed": "{{count}} 个已完成",
      "form.add.placeholder.title": "任务标题...",
      "form.add.placeholder.content": "详情 (可选)...",
      "form.add.button.adding": "添加中...",
      "form.add.button.default": "添加任务",
      "list.empty": "暂无任务，快来添加一个吧！",
      "action.delete.confirm": "确认删除吗？",
      "action.archive.button": "归档已完成任务",
      "action.archive.confirm": "确认归档所有已完成任务吗？",
      "action.delete.title": "删除"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "zh", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already safes from xss
    }
  });

export default i18n;
