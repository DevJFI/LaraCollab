import { Label } from "@/components/Label";
import useTaskDrawerStore from "@/hooks/store/useTaskDrawerStore";
import { isOverdue } from "@/utils/task";
import { getTaskPriorityConfig } from "@/utils/taskPriority";
import { getInitials } from "@/utils/user";
import { Draggable } from "@hello-pangea/dnd";
import { Link } from "@inertiajs/react";
import { Avatar, Group, Text, Tooltip, rem, useComputedColorScheme } from "@mantine/core";
import TaskActions from "../TaskActions";
import classes from "./css/TaskCard.module.css";

export default function TaskCard({ task, index }) {
  const { openEditTask } = useTaskDrawerStore();
  const computedColorScheme = useComputedColorScheme();
  const priorityConfig = getTaskPriorityConfig(task.priority);

  return (
    <Draggable draggableId={"task-" + task.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={`${classes.task} ${snapshot.isDragging && classes.itemDragging} ${
            task.completed_at !== null && classes.completed
          }`}
        >
          <div {...(can("reorder task") && provided.dragHandleProps)}>
            <Group justify="space-between" align="center">
              <Text
                className={classes.name}
                size="xs"
                fw={500}
                c={isOverdue(task) && task.completed_at === null ? "red.7" : ""}
                onClick={() => openEditTask(task)}
              >
                #{task.number + ": " + task.name}
              </Text>

              {priorityConfig && (
                <Tooltip label={priorityConfig.label} withArrow openDelay={300}>
                  <div
                    aria-label={priorityConfig.label}
                    className="flex items-center"
                  >
                    <span
                      className={`inline-block h-2 w-2 rounded-full bg-${priorityConfig.color}-5`}
                    />
                  </div>
                </Tooltip>
              )}
            </Group>

            <Group wrap="nowrap" justify="space-between">
              <Group wrap="wrap" style={{ rowGap: rem(3), columnGap: rem(12) }} mt={5}>
                {task.labels.map((label) => (
                  <Label
                    key={label.id}
                    name={label.name}
                    color={label.color}
                    size={9}
                    dot={false}
                  />
                ))}
              </Group>

              {task.assigned_to_user && (
                <Tooltip label={task.assigned_to_user.name} openDelay={1000} withArrow>
                  <Link
                    href={route("users.edit", task.assigned_to_user.id)}
                    style={{ textDecoration: "none" }}
                  >
                    <Avatar
                      src={task.assigned_to_user.avatar}
                      radius="xl"
                      size={20}
                      color={computedColorScheme === "light" ? "white" : "blue"}
                    >
                      {getInitials(task.assigned_to_user.name)}
                    </Avatar>
                  </Link>
                </Tooltip>
              )}

              {(can("archive task") || can("restore task")) && (
                <TaskActions task={task} className={classes.actions} />
              )}
            </Group>
          </div>
        </div>
      )}
    </Draggable>
  );
}
