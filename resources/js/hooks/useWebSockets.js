import { usePage } from "@inertiajs/react";
import { showNotification } from "@mantine/notifications";
import useNotificationsStore from "./store/useNotificationsStore";
import useTaskGroupsStore from "./store/useTaskGroupsStore";
import useTasksStore from "./store/useTasksStore";

export default function useWebSockets() {
  const { auth: { user } } = usePage().props;
  const { addNotification } = useNotificationsStore();
  const {
    addTaskLocally, updateTaskLocally, removeTaskLocally, restoreTaskLocally, addCommentLocally, addAttachmentsLocally,
    removeAttachmentLocally, addTimeLogLocally, removeTimeLogLocally, reorderTaskLocally, moveTaskLocally,
  } = useTasksStore();
  const {
    addTaskGroupLocally, updateTaskGroupLocally, removeTaskGroupLocally, restoreTaskGroupLocally, reorderTaskGroupLocally,
  } = useTaskGroupsStore();

const initUserWebSocket = () => {
    // 1. Verificação de segurança robusta
    if (!window.Echo || typeof window.Echo.private !== 'function' || !user || !user.id) {
      console.warn('WebSockets não configurados ou usuário inválido.');
      return;
    }

    try {
      // 2. Proteção adicional: garantimos que o Echo só tente conectar se estiver instanciado
      window.Echo.private(`App.Models.User.${user.id}`)
        .notification((notification) => {
          addNotification(notification);

          showNotification({
            title: notification.title,
            message: notification.subtitle,
            autoClose: 8000,
          });
        });
    } catch (error) {
      // 3. Bloco try-catch para capturar qualquer erro interno do Echo sem derrubar o React
      console.error('Erro ao inicializar canal privado:', error);
    }
  };

  const initProjectWebSocket = (project) => {
    window.Echo.private(`App.Models.Project.${project.id}`)
      .listen('Task\\TaskCreated', (e) => addTaskLocally(e.task))
      .listen('Task\\TaskUpdated', (e) => updateTaskLocally(e.taskId, e.property, e.value, e.relatedData))
      .listen('Task\\TaskDeleted', (e) => removeTaskLocally(e.taskId))
      .listen('Task\\TaskRestored', (e) => restoreTaskLocally(e.groupId, e.task))
      .listen('Task\\CommentCreated', (e) => addCommentLocally(e.comment))
      .listen('Task\\AttachmentsUploaded', (e) => addAttachmentsLocally(e.attachments))
      .listen('Task\\AttachmentDeleted', (e) => removeAttachmentLocally(e.taskId, e.attachmentId))
      .listen('Task\\TimeLogCreated', (e) => addTimeLogLocally(e.timeLog))
      .listen('Task\\TimeLogDeleted', (e) => removeTimeLogLocally(e.taskId, e.timeLogId))
      .listen('Task\\TaskOrderChanged', (e) => reorderTaskLocally(e.groupId, e.fromIndex, e.toIndex))
      .listen('Task\\TaskGroupChanged', (e) => moveTaskLocally(e.fromGroupId, e.toGroupId, e.fromIndex, e.toIndex))
      .listen('TaskGroup\\TaskGroupCreated', (e) => addTaskGroupLocally(e.taskGroup))
      .listen('TaskGroup\\TaskGroupUpdated', (e) => updateTaskGroupLocally(e.taskGroup))
      .listen('TaskGroup\\TaskGroupDeleted', (e) => removeTaskGroupLocally(e.taskGroupId))
      .listen('TaskGroup\\TaskGroupRestored', (e) => restoreTaskGroupLocally(e.taskGroup))
      .listen('TaskGroup\\TaskGroupOrderChanged', (e) => reorderTaskGroupLocally(e.taskGroupIds))

    return () => window.Echo.leave(`App.Models.Project.${project.id}`);
  };

  const initTaskWebSocket = (task) => {
    window.Echo.private(`App.Models.Task.${task.id}`)
      .listen('Task\\CommentCreated', (e) => addCommentLocally(e.comment));

    return () => window.Echo.leave(`App.Models.Task.${task.id}`);
  };

  return { initUserWebSocket, initProjectWebSocket, initTaskWebSocket };
}
