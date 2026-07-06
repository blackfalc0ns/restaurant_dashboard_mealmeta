import {
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const OTP_LENGTH = 6;

@Component({
  selector: 'mm-otp-input',
  standalone: true,
  template: `
    <div
      class="flex items-center justify-center gap-2 sm:gap-2.5"
      role="group"
      [attr.aria-label]="ariaLabel()"
    >
      @for (index of slots; track index) {
        <input
          #digitInput
          class="mm-restaurant-auth__otp-digit"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          autocomplete="one-time-code"
          [class.mm-restaurant-auth__otp-digit--filled]="digits()[index]"
          [value]="digits()[index]"
          (input)="onDigitInput(index, $event)"
          (keydown)="onDigitKeydown(index, $event)"
          (paste)="onPaste($event)"
          (focus)="onFocus($event)"
        />
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
})
export class OtpInputComponent implements ControlValueAccessor {
  readonly ariaLabel = input('Verification code');
  readonly digitInputs = viewChildren<ElementRef<HTMLInputElement>>('digitInput');

  readonly slots = Array.from({ length: OTP_LENGTH }, (_, index) => index);
  readonly digits = signal<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private disabled = false;

  writeValue(value: string | null): void {
    const normalized = (value ?? '').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array.from({ length: OTP_LENGTH }, (_, index) => normalized[index] ?? '');
    this.digits.set(next);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.digitInputs().forEach((ref) => {
      ref.nativeElement.disabled = isDisabled;
    });
  }

  onDigitInput(index: number, event: Event): void {
    if (this.disabled) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    this.updateDigit(index, digit);

    if (digit && index < OTP_LENGTH - 1) {
      this.focusDigit(index + 1);
    }
  }

  onDigitKeydown(index: number, event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      event.preventDefault();
      this.updateDigit(index - 1, '');
      this.focusDigit(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusDigit(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      this.focusDigit(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this.disabled) {
      return;
    }

    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const normalized = pasted.replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (!normalized) {
      return;
    }

    const next = Array.from({ length: OTP_LENGTH }, (_, index) => normalized[index] ?? '');
    this.digits.set(next);
    this.emitValue(next);

    const focusIndex = Math.min(normalized.length, OTP_LENGTH - 1);
    this.focusDigit(focusIndex);
  }

  onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  private updateDigit(index: number, value: string): void {
    const next = [...this.digits()];
    next[index] = value;
    this.digits.set(next);
    this.emitValue(next);
  }

  private emitValue(next: string[]): void {
    const code = next.join('');
    this.onChange(code);
    this.onTouched();
  }

  private focusDigit(index: number): void {
    const inputs = this.digitInputs();
    inputs[index]?.nativeElement.focus();
  }
}
