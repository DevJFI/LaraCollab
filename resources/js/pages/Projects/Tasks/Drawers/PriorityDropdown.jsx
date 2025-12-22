import { getTaskPriorityConfig, getTaskPriorityOptions } from '@/utils/taskPriority';
import {
  Box,
  ColorSwatch,
  Combobox,
  Group,
  Input,
  InputBase,
  Text,
  useCombobox,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export default function PriorityDropdown({ value, onChange, ...props }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = getTaskPriorityOptions();
  const selectedPriority = value ? getTaskPriorityConfig(value) : null;

  const handleSelect = (val) => {
    onChange(val);
    combobox.closeDropdown();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <Box {...props}>
      <Input.Label>Priority</Input.Label>
      <Combobox
        store={combobox}
        onOptionSubmit={handleSelect}
        withinPortal={false}
        disabled={!can('edit task')}
      >
        <Combobox.Target>
          <InputBase
            component='button'
            type='button'
            pointer
            onClick={() => combobox.toggleDropdown()}
            rightSection={
              selectedPriority && can('edit task') ? (
                <IconX
                  size={14}
                  style={{ cursor: 'pointer' }}
                  onClick={handleClear}
                />
              ) : (
                <Combobox.Chevron />
              )
            }
            rightSectionPointerEvents={selectedPriority ? 'all' : 'none'}
          >
            {selectedPriority ? (
              <Group gap={7}>
                <ColorSwatch
                  color={`var(--mantine-color-${selectedPriority.color}-5)`}
                  size={10}
                />
                <Text size='sm'>{selectedPriority.label}</Text>
              </Group>
            ) : (
              <Input.Placeholder>Select priority</Input.Placeholder>
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {options.map((option) => (
              <Combobox.Option
                value={option.value}
                key={option.value}
                active={value?.toString() === option.value}
              >
                <Group gap={7}>
                  <ColorSwatch
                    color={`var(--mantine-color-${option.color}-5)`}
                    size={10}
                  />
                  <Text size='sm'>{option.label}</Text>
                </Group>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  );
}
