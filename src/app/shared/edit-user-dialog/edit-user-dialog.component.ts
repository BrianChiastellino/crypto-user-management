import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../auth/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { filter, Observable, pipe, switchMap, tap } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements OnInit {

  public hidePassword: boolean = true;
  public user: User | null = null;
  public editMode: boolean = true;

  public editForm: FormGroup = this.fb.group({

    name: ['', Validators.required],
    email: ['', Validators.required],
    document: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    admin: [false],

  })


  constructor (
    private dialogRef: MatDialogRef<EditUserDialogComponent, boolean>,
    @Inject (MAT_DIALOG_DATA) public idUser: string | null,
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {

    if( this.idUser ) {

      this.authService.getUserById( this.idUser )
      .pipe(
        tap( user => this.user = user ),
      )
      .subscribe( user => this.editForm.reset(user));
    } else {
      this.editMode = false;
    }


  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    if (this.isFormInvalid()) return;

    const user: User = this.createUserFromForm();
    const userObservable: Observable<User | null> = this.editMode ? this.updateUser(user) : this.createUser(user);

    this.handleUserObservable(userObservable);
  }

  private isFormInvalid(): boolean {
    return !this.editForm.valid;
  }

  private createUserFromForm(): User {
    return new User({ ...this.editForm.value });
  }

  private updateUser(user: User) {
    user.id = this.idUser!;
    return this.authService.updateUser(user);
  }

  private createUser(user: User) {
    return this.authService.addUser(user);
  }

  private handleUserObservable(userObservable: Observable<User | null>): void {
    userObservable.pipe(
      filter(data => !!data),
      tap(() => this.toastService.showSuccess('Éxito', 'Operación realizada con éxito!'))
    ).subscribe(data => this.dialogRef.close(!!data));
  }




  public showPassword () : void {
    this.hidePassword = !this.hidePassword;
  }

  public isValidfield ( field: string ) : boolean | null {
    return this.editForm.controls[field].errors
    && this.editForm.controls[field].touched;
  }

  public getFieldError ( field: string ) : string | null {

    if ( !this.editForm.controls[field] ) return null;

    const errors = this.editForm.controls[field].errors || {};

    for ( const key of Object.keys(errors) ) {

      switch (key) {

        case 'required':
          return 'Este campo es requerido';


      }

    }

    return null;

  }



}
