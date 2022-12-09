import type { OpenModalFn } from '../../../utils/types';
import type { Device } from './StandardTable';
import type { DSelectItem } from '@react-devui/ui/components/select';

import { isUndefined } from 'lodash';
import React, { useImperativeHandle, useState } from 'react';

import { useAsync, useEventCallback, useId } from '@react-devui/hooks';
import { FormControl, FormGroup, useForm, Validators } from '@react-devui/ui';
import { DForm, DInput, DModal, DSelect } from '@react-devui/ui';

export interface AppDeviceModalProps {
  aModelList: DSelectItem<string>[] | undefined;
}

function DeviceModal(props: AppDeviceModalProps, ref: React.ForwardedRef<OpenModalFn<Device>>): JSX.Element | null {
  const { aModelList } = props;

  const async = useAsync();

  const uniqueId = useId();
  const id = `app-form-${uniqueId}`;

  const [visible, setVisible] = useState(false);
  const [device, setDevice] = useState<Device>();
  const [form, updateForm] = useForm(
    () =>
      new FormGroup({
        name: new FormControl('', Validators.required),
        model: new FormControl<string | null>(null, Validators.required),
      })
  );

  const open = useEventCallback<OpenModalFn<Device>>((device) => {
    setVisible(true);
    setDevice(device);
    form.reset(device ? { name: device.name, model: device.model } : undefined);
    updateForm();
  });

  useImperativeHandle(ref, () => open, [open]);

  return (
    <DModal
      dVisible={visible}
      dHeader={`${device ? 'Edit' : 'Add'} Device`}
      dFooter={
        <DModal.Footer
          dOkProps={{ type: 'submit', form: id, disabled: !form.valid }}
          onOkClick={() =>
            new Promise((r) => {
              async.setTimeout(() => {
                r(true);
              }, 500);
            })
          }
        ></DModal.Footer>
      }
      dMaskClosable={false}
      onClose={() => {
        setVisible(false);
      }}
    >
      <DForm id={id} dUpdate={updateForm} dLabelWidth="6em">
        <DForm.Group dFormGroup={form}>
          <DForm.Item dFormControls={{ name: 'Please enter name!' }} dLabel="Name">
            {({ name }) => <DInput dFormControl={name} dPlaceholder="Name" />}
          </DForm.Item>
          <DForm.Item dFormControls={{ model: 'Please select model!' }} dLabel="Model">
            {({ model }) => (
              <DSelect
                dFormControl={aModelList ? model : undefined}
                dList={aModelList ?? []}
                dLoading={isUndefined(aModelList)}
                dPlaceholder="Model"
                dClearable
              />
            )}
          </DForm.Item>
        </DForm.Group>
      </DForm>
    </DModal>
  );
}

export const AppDeviceModal = React.forwardRef(DeviceModal);